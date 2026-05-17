from fastapi import APIRouter, HTTPException, Depends
from app.database import supabase
from app.models.wallet import WithdrawalRequest, WithdrawalResponse, WalletTransactionResponse, WalletBalanceResponse
from app.middleware.auth import get_current_user, require_admin

router = APIRouter()


@router.get("/balance")
async def get_balance(user=Depends(get_current_user)):
    profile = supabase.table("profiles").select("wallet_balance, total_earnings").eq("user_id", user.id).execute()
    if not profile.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    pending = supabase.table("withdrawals").select("amount").eq("user_id", user.id).eq("status", "pending").execute()
    pending_total = sum(w["amount"] for w in pending.data) if pending.data else 0

    return {
        "wallet_balance": profile.data[0]["wallet_balance"],
        "total_earnings": profile.data[0]["total_earnings"],
        "pending_withdrawals": pending_total,
    }


@router.get("/transactions")
async def get_transactions(user=Depends(get_current_user)):
    txns = supabase.table("wallet_transactions").select("*").eq("user_id", user.id).order("created_at", desc=True).execute()
    return txns.data


@router.post("/withdraw")
async def request_withdrawal(data: WithdrawalRequest, user=Depends(get_current_user)):
    profile = supabase.table("profiles").select("wallet_balance").eq("user_id", user.id).execute()
    if not profile.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    if profile.data[0]["wallet_balance"] < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")

    withdrawal_data = {
        "user_id": user.id,
        "amount": data.amount,
        "method": data.method.value,
        "status": "pending",
    }

    if data.method.value == "bank_transfer":
        withdrawal_data["bank_name"] = data.bank_name
        withdrawal_data["account_number"] = data.account_number
        withdrawal_data["ifsc_code"] = data.ifsc_code
    else:
        withdrawal_data["upi_id"] = data.upi_id

    result = supabase.table("withdrawals").insert(withdrawal_data).execute()
    return result.data[0]


@router.get("/withdrawals")
async def get_withdrawals(user=Depends(get_current_user)):
    withdrawals = supabase.table("withdrawals").select("*").eq("user_id", user.id).order("requested_at", desc=True).execute()
    return withdrawals.data


@router.get("/withdrawals/admin", dependencies=[Depends(require_admin)])
async def get_all_withdrawals():
    withdrawals = supabase.table("withdrawals").select("*").order("requested_at", desc=True).execute()
    return withdrawals.data


@router.put("/withdrawals/{withdrawal_id}/approve", dependencies=[Depends(require_admin)])
async def approve_withdrawal(withdrawal_id: str):
    withdrawal = supabase.table("withdrawals").select("*").eq("id", withdrawal_id).execute()
    if not withdrawal.data:
        raise HTTPException(status_code=404, detail="Withdrawal not found")

    user_id = withdrawal.data[0]["user_id"]
    amount = withdrawal.data[0]["amount"]

    profile = supabase.table("profiles").select("wallet_balance").eq("user_id", user_id).execute()
    current_balance = profile.data[0]["wallet_balance"]

    supabase.table("profiles").update({"wallet_balance": current_balance - amount}).eq("user_id", user_id).execute()

    supabase.table("wallet_transactions").insert({
        "user_id": user_id,
        "type": "withdrawal",
        "amount": -amount,
        "balance_before": current_balance,
        "balance_after": current_balance - amount,
        "reference_id": withdrawal_id,
        "status": "completed",
    }).execute()

    supabase.table("withdrawals").update({"status": "completed"}).eq("id", withdrawal_id).execute()

    return {"message": "Withdrawal approved and completed"}


@router.put("/withdrawals/{withdrawal_id}/reject", dependencies=[Depends(require_admin)])
async def reject_withdrawal(withdrawal_id: str, data: dict = None):
    supabase.table("withdrawals").update({
        "status": "rejected",
        "admin_notes": data.get("notes", "") if data else "",
    }).eq("id", withdrawal_id).execute()
    return {"message": "Withdrawal rejected"}
