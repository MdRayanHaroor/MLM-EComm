from fastapi import APIRouter, HTTPException, Depends
from app.database import supabase
from app.models.admin import AdminUserUpdate, AdminDashboardStats, OrderStatusUpdate
from app.models.commission import CommissionSettingsUpdate, CommissionSettingsResponse, RankSettingsCreate, RankSettingsUpdate
from app.middleware.auth import require_admin, require_super_admin

router = APIRouter()


@router.get("/dashboard", dependencies=[Depends(require_admin)])
async def get_dashboard():
    users = supabase.table("users").select("id, role, status").execute()
    total_users = len(users.data)
    active_distributors = len([u for u in users.data if u["role"] == "distributor" and u["status"] == "active"])

    orders = supabase.table("orders").select("*").execute()
    total_orders = len(orders.data)
    total_revenue = sum(o["total_amount"] for o in orders.data if o["payment_status"] == "paid")

    withdrawals = supabase.table("withdrawals").select("amount, status").execute()
    pending_withdrawals = sum(w["amount"] for w in withdrawals.data if w["status"] == "pending")

    commissions = supabase.table("commissions").select("amount, status").execute()
    total_commissions = sum(c["amount"] for c in commissions.data if c["status"] == "credited")

    return {
        "total_users": total_users,
        "active_distributors": active_distributors,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "pending_withdrawals": pending_withdrawals,
        "total_commissions_paid": total_commissions,
    }


@router.get("/users", dependencies=[Depends(require_admin)])
async def get_all_users():
    users = supabase.table("users").select("id, email, full_name, phone, role, referral_code, sponsor_id, status, created_at").execute()
    return users.data


@router.put("/users/{user_id}", dependencies=[Depends(require_admin)])
async def update_user(user_id: str, data: AdminUserUpdate):
    update_data = data.model_dump(exclude_none=True)
    result = supabase.table("users").update(update_data).eq("id", user_id).execute()
    return result.data[0] if result.data else {"message": "No changes"}


@router.get("/settings/commissions", dependencies=[Depends(require_super_admin)])
async def get_commission_settings():
    settings = supabase.table("commission_settings").select("*").limit(1).execute()
    if not settings.data:
        supabase.table("commission_settings").insert({
            "direct_referral_percent": 10,
            "level_1_percent": 5,
            "level_2_percent": 3,
            "level_3_percent": 2,
            "level_4_percent": 1,
        }).execute()
        settings = supabase.table("commission_settings").select("*").limit(1).execute()
    return settings.data[0]


@router.put("/settings/commissions", dependencies=[Depends(require_super_admin)])
async def update_commission_settings(data: CommissionSettingsUpdate):
    existing = supabase.table("commission_settings").select("id").limit(1).execute()
    if existing.data:
        result = supabase.table("commission_settings").update(data.model_dump()).eq("id", existing.data[0]["id"]).execute()
    else:
        result = supabase.table("commission_settings").insert(data.model_dump()).execute()
    return result.data[0]


@router.get("/settings/ranks", dependencies=[Depends(require_super_admin)])
async def get_rank_settings():
    ranks = supabase.table("rank_settings").select("*").eq("is_active", True).execute()
    return ranks.data


@router.post("/settings/ranks", dependencies=[Depends(require_super_admin)])
async def create_rank(data: RankSettingsCreate):
    result = supabase.table("rank_settings").insert(data.model_dump()).execute()
    return result.data[0]


@router.put("/settings/ranks/{rank_id}", dependencies=[Depends(require_super_admin)])
async def update_rank(rank_id: str, data: RankSettingsUpdate):
    update_data = data.model_dump(exclude_none=True)
    result = supabase.table("rank_settings").update(update_data).eq("id", rank_id).execute()
    return result.data[0] if result.data else {"message": "No changes"}


@router.get("/reports/sales", dependencies=[Depends(require_admin)])
async def get_sales_report():
    orders = supabase.table("orders").select("*").eq("payment_status", "paid").execute()
    total_sales = sum(o["total_amount"] for o in orders.data)
    total_gst = sum(o["gst_amount"] for o in orders.data)
    total_shipping = sum(o["shipping_amount"] for o in orders.data)

    return {
        "total_sales": total_sales,
        "total_gst": total_gst,
        "total_shipping": total_shipping,
        "net_revenue": total_sales - total_gst,
        "order_count": len(orders.data),
    }


@router.get("/reports/commissions", dependencies=[Depends(require_admin)])
async def get_commission_report():
    commissions = supabase.table("commissions").select("*").execute()
    total_paid = sum(c["amount"] for c in commissions.data if c["status"] == "credited")
    total_pending = sum(c["amount"] for c in commissions.data if c["status"] == "pending")

    by_type = {}
    for c in commissions.data:
        t = c["type"]
        if t not in by_type:
            by_type[t] = {"count": 0, "amount": 0}
        by_type[t]["count"] += 1
        by_type[t]["amount"] += c["amount"]

    return {
        "total_paid": total_paid,
        "total_pending": total_pending,
        "by_type": by_type,
    }
