from fastapi import APIRouter, Depends
from app.database import supabase
from app.middleware.auth import get_current_user
from app.services.matrix import get_downline_tree, get_upline_chain

router = APIRouter()


@router.get("/referrals")
async def get_referrals(user=Depends(get_current_user)):
    referrals = supabase.table("users").select("id, full_name, email, phone, referral_code, status, created_at").eq("sponsor_id", user.id).execute()
    return referrals.data


@router.get("/downline")
async def get_downline(user=Depends(get_current_user)):
    tree = get_downline_tree(user.id)
    return tree


@router.get("/upline")
async def get_upline(user=Depends(get_current_user)):
    chain = get_upline_chain(user.id)
    return chain


@router.get("/matrix")
async def get_matrix(user=Depends(get_current_user)):
    position = supabase.table("matrix_positions").select("*").eq("user_id", user.id).execute()
    return position.data[0] if position.data else None
