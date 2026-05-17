from fastapi import APIRouter, Depends
from app.database import supabase
from app.middleware.auth import get_current_user, require_admin

router = APIRouter()


@router.get("/")
async def get_commissions(user=Depends(get_current_user)):
    commissions = supabase.table("commissions").select("*").eq("user_id", user.id).order("created_at", desc=True).execute()
    return commissions.data


@router.get("/admin", dependencies=[Depends(require_admin)])
async def get_all_commissions():
    commissions = supabase.table("commissions").select("*").order("created_at", desc=True).execute()
    return commissions.data
