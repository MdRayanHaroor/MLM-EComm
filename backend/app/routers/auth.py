from fastapi import APIRouter, HTTPException, Depends
from app.database import supabase
from app.models.auth import RegisterRequest, LoginRequest, UserResponse, ProfileResponse, ProfileUpdate
from app.middleware.auth import get_current_user
import uuid
import string
import random

router = APIRouter()


def generate_referral_code() -> str:
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=8))


@router.post("/register")
async def register(data: RegisterRequest):
    try:
        existing = supabase.table("users").select("id").eq("email", data.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        auth_response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
        })

        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Registration failed")

        user_id = auth_response.user.id
        referral_code = generate_referral_code()

        sponsor_id = None
        if data.referral_code:
            sponsor_result = supabase.table("users").select("id").eq("referral_code", data.referral_code).execute()
            if sponsor_result.data:
                sponsor_id = sponsor_result.data[0]["id"]

        user_record = {
            "id": user_id,
            "email": data.email,
            "full_name": data.full_name,
            "phone": data.phone,
            "role": "distributor",
            "sponsor_id": sponsor_id,
            "referral_code": referral_code,
            "status": "active",
        }

        supabase.table("users").insert(user_record).execute()

        supabase.table("profiles").insert({
            "user_id": user_id,
            "pv_balance": 0,
            "current_rank": "Starter",
            "total_earnings": 0,
            "wallet_balance": 0,
        }).execute()

        if sponsor_id:
            from app.services.matrix import place_in_matrix
            place_in_matrix(user_id, sponsor_id)

        return {"message": "Registration successful", "user_id": user_id, "referral_code": referral_code}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
async def login(data: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })

        if not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user_id": response.user.id,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/logout")
async def logout(token: str = Depends(get_current_user)):
    supabase.auth.sign_out()
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    user_data = supabase.table("users").select("*").eq("id", user.id).execute()
    if not user_data.data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data.data[0]


@router.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    profile = supabase.table("profiles").select("*").eq("user_id", user.id).execute()
    if not profile.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile.data[0]


@router.put("/profile")
async def update_profile(data: ProfileUpdate, user=Depends(get_current_user)):
    update_data = data.model_dump(exclude_none=True)
    if update_data:
        supabase.table("users").update(update_data).eq("id", user.id).execute()
    return {"message": "Profile updated"}
