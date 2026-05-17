from app.database import supabase
from app.services.matrix import get_upline_chain


def calculate_commissions(order_id: str, order_total: float, buyer_id: str):
    settings = supabase.table("commission_settings").select("*").limit(1).execute()
    if not settings.data:
        return

    s = settings.data[0]
    percentages = {
        "direct_referral": s["direct_referral_percent"],
        "level_1": s["level_1_percent"],
        "level_2": s["level_2_percent"],
        "level_3": s["level_3_percent"],
        "level_4": s["level_4_percent"],
    }

    upline = get_upline_chain(buyer_id, levels=4)

    if not upline:
        return

    sponsor = upline[0]
    _create_commission(sponsor["id"], order_id, "direct_referral", order_total, percentages["direct_referral"])

    for i, member in enumerate(upline[1:], start=1):
        level_key = f"level_{i}"
        if level_key in percentages:
            _create_commission(member["id"], order_id, level_key, order_total, percentages[level_key])


def _create_commission(user_id: str, order_id: str, commission_type: str, order_total: float, percentage: float):
    distributor_check = supabase.table("users").select("role").eq("id", user_id).execute()
    if not distributor_check.data or distributor_check.data[0]["role"] not in ["distributor", "admin", "super_admin"]:
        return

    amount = round(order_total * (percentage / 100), 2)
    if amount <= 0:
        return

    supabase.table("commissions").insert({
        "user_id": user_id,
        "from_order_id": order_id,
        "type": commission_type,
        "amount": amount,
        "pv_earned": 0,
        "status": "pending",
    }).execute()


def credit_commissions_for_order(order_id: str, pv_amount: float = 0):
    commissions = supabase.table("commissions").select("*").eq("from_order_id", order_id).eq("status", "pending").execute()

    for comm in commissions.data:
        user_id = comm["user_id"]
        amount = comm["amount"]

        profile = supabase.table("profiles").select("wallet_balance, total_earnings, pv_balance").eq("user_id", user_id).execute()
        if not profile.data:
            continue

        current_wallet = profile.data[0]["wallet_balance"]
        current_earnings = profile.data[0]["total_earnings"]
        current_pv = profile.data[0]["pv_balance"]

        supabase.table("profiles").update({
            "wallet_balance": current_wallet + amount,
            "total_earnings": current_earnings + amount,
            "pv_balance": current_pv + pv_amount,
        }).eq("user_id", user_id).execute()

        supabase.table("wallet_transactions").insert({
            "user_id": user_id,
            "type": "commission_credit",
            "amount": amount,
            "balance_before": current_wallet,
            "balance_after": current_wallet + amount,
            "reference_id": order_id,
            "status": "completed",
        }).execute()

        supabase.table("commissions").update({"status": "credited"}).eq("id", comm["id"]).execute()


def reverse_commissions_for_order(order_id: str):
    commissions = supabase.table("commissions").select("*").eq("from_order_id", order_id).eq("status", "credited").execute()

    for comm in commissions.data:
        user_id = comm["user_id"]
        amount = comm["amount"]

        profile = supabase.table("profiles").select("wallet_balance, total_earnings").eq("user_id", user_id).execute()
        if not profile.data:
            continue

        current_wallet = profile.data[0]["wallet_balance"]

        supabase.table("profiles").update({
            "wallet_balance": max(0, current_wallet - amount),
        }).eq("user_id", user_id).execute()

        supabase.table("wallet_transactions").insert({
            "user_id": user_id,
            "type": "reversal",
            "amount": -amount,
            "balance_before": current_wallet,
            "balance_after": max(0, current_wallet - amount),
            "reference_id": order_id,
            "status": "completed",
        }).execute()

        supabase.table("commissions").update({"status": "reversed"}).eq("id", comm["id"]).execute()
