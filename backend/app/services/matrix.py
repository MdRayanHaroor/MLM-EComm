from app.database import supabase
from collections import deque


def place_in_matrix(user_id: str, sponsor_id: str):
    queue = deque()
    queue.append(sponsor_id)

    while queue:
        current_sponsor = queue.popleft()

        sponsor_matrix = supabase.table("matrix_positions").select("*").eq("user_id", current_sponsor).execute()

        if not sponsor_matrix.data:
            # Sponsor has no matrix row yet; place under original sponsor with no parent
            _create_position(user_id, sponsor_id, None, 1)
            return

        filled_positions = [p["position"] for p in sponsor_matrix.data if p["user_id"] == current_sponsor]

        for pos in range(1, 5):
            if pos not in filled_positions:
                # parent_user_id = current_sponsor so we can resolve to matrix_positions.id
                _create_position(user_id, current_sponsor, current_sponsor, pos)
                return

        children = supabase.table("matrix_positions").select("user_id").eq("sponsor_id", current_sponsor).execute()
        for child in children.data:
            queue.append(child["user_id"])

    _spillover_placement(user_id, sponsor_id)


def _create_position(user_id: str, sponsor_id: str, parent_user_id: str | None, position: int):
    """
    Insert a new matrix_positions row for user_id.

    parent_user_id: the user_id of the parent node (used to look up the
                    matrix_positions.id UUID that satisfies the FK constraint).
                    Pass None when the new node has no parent (root / orphan).
    """
    sponsor_row = supabase.table("matrix_positions").select("id, level").eq("user_id", sponsor_id).execute()
    level = 0
    if sponsor_row.data:
        level = sponsor_row.data[0]["level"] + 1

    # Resolve parent_id: the FK references matrix_positions.id, NOT users.id
    parent_id = None
    if parent_user_id is not None:
        parent_row = supabase.table("matrix_positions").select("id").eq("user_id", parent_user_id).execute()
        if parent_row.data:
            parent_id = parent_row.data[0]["id"]
        # If the parent has no matrix row yet, leave parent_id as None to avoid FK violation

    supabase.table("matrix_positions").insert({
        "user_id": user_id,
        "sponsor_id": sponsor_id,
        "parent_id": parent_id,
        "level": level,
        "position": position,
    }).execute()


def _spillover_placement(user_id: str, original_sponsor: str):
    upline = supabase.table("matrix_positions").select("sponsor_id").eq("user_id", original_sponsor).execute()

    if upline.data and upline.data[0]["sponsor_id"]:
        place_in_matrix(user_id, upline.data[0]["sponsor_id"])
    else:
        supabase.table("matrix_positions").insert({
            "user_id": user_id,
            "sponsor_id": original_sponsor,
            "parent_id": None,
            "level": 0,
            "position": 1,
        }).execute()


def get_downline_tree(user_id: str, max_depth: int = 4):
    result = []
    _build_tree(user_id, result, 0, max_depth)
    return result


def _build_tree(user_id: str, result: list, current_depth: int, max_depth: int):
    if current_depth >= max_depth:
        return

    children = supabase.table("matrix_positions").select("user_id, position, level").eq("sponsor_id", user_id).execute()

    for child in children.data:
        user_info = supabase.table("users").select("full_name, referral_code, status").eq("id", child["user_id"]).execute()
        profile_info = supabase.table("profiles").select("pv_balance, current_rank").eq("user_id", child["user_id"]).execute()

        node = {
            "user_id": child["user_id"],
            "position": child["position"],
            "level": child["level"],
            "full_name": user_info.data[0]["full_name"] if user_info.data else None,
            "referral_code": user_info.data[0]["referral_code"] if user_info.data else None,
            "status": user_info.data[0]["status"] if user_info.data else None,
            "pv_balance": profile_info.data[0]["pv_balance"] if profile_info.data else 0,
            "current_rank": profile_info.data[0]["current_rank"] if profile_info.data else "Starter",
            "children": [],
        }

        result.append(node)
        _build_tree(child["user_id"], node["children"], current_depth + 1, max_depth)


def get_upline_chain(user_id: str, levels: int = 4):
    chain = []
    current = user_id

    for _ in range(levels):
        parent = supabase.table("matrix_positions").select("sponsor_id").eq("user_id", current).execute()
        if not parent.data or not parent.data[0]["sponsor_id"]:
            break
        sponsor_id = parent.data[0]["sponsor_id"]
        user_info = supabase.table("users").select("id, full_name, role").eq("id", sponsor_id).execute()
        if user_info.data:
            chain.append(user_info.data[0])
        current = sponsor_id

    return chain
