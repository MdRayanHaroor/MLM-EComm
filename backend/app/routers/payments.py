from fastapi import APIRouter, HTTPException, Depends, Request
from app.database import supabase
from app.config import get_settings
from app.middleware.auth import get_current_user
import httpx
import base64
import hashlib
import hmac

settings = get_settings()

router = APIRouter()


def _razorpay_auth():
    credentials = f"{settings.RAZORPAY_KEY_ID}:{settings.RAZORPAY_KEY_SECRET}"
    return "Basic " + base64.b64encode(credentials.encode()).decode()


async def _razorpay_post(endpoint: str, payload: dict):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"https://api.razorpay.com/v1/{endpoint}",
            json=payload,
            headers={"Authorization": _razorpay_auth()},
        )
        return resp.json()


@router.post("/create-order")
async def create_razorpay_order(order_data: dict, user=Depends(get_current_user)):
    order_id = order_data.get("order_id")
    amount = order_data.get("amount")

    if not order_id or not amount:
        raise HTTPException(status_code=400, detail="order_id and amount required")

    order = supabase.table("orders").select("*").eq("id", order_id).eq("user_id", user.id).execute()
    if not order.data:
        raise HTTPException(status_code=404, detail="Order not found")

    rzp_order = await _razorpay_post("orders", {
        "amount": int(amount * 100),
        "currency": "INR",
        "receipt": order.data[0]["order_number"],
        "payment_capture": 1,
    })

    supabase.table("orders").update({"razorpay_order_id": rzp_order["id"]}).eq("id", order_id).execute()

    return {
        "razorpay_order_id": rzp_order["id"],
        "amount": amount,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID,
    }


@router.post("/verify")
async def verify_payment(data: dict, user=Depends(get_current_user)):
    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

    try:
        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()

        if expected != razorpay_signature:
            raise HTTPException(status_code=400, detail="Payment verification failed")
    except HTTPException:
        raise
        raise HTTPException(status_code=400, detail="Payment verification failed")

    order = supabase.table("orders").select("*").eq("razorpay_order_id", razorpay_order_id).eq("user_id", user.id).execute()
    if not order.data:
        raise HTTPException(status_code=404, detail="Order not found")

    supabase.table("orders").update({
        "payment_status": "paid",
        "razorpay_payment_id": razorpay_payment_id,
        "status": "confirmed",
    }).eq("id", order.data[0]["id"]).execute()

    from app.services.commission import calculate_commissions, credit_commissions_for_order

    order_total = order.data[0]["total_amount"]
    calculate_commissions(order.data[0]["id"], order_total, user.id)

    order_items = supabase.table("order_items").select("pv").eq("order_id", order.data[0]["id"]).execute()
    total_pv = sum(item["pv"] for item in order_items.data) if order_items.data else 0

    credit_commissions_for_order(order.data[0]["id"], total_pv)

    return {"message": "Payment verified successfully", "order_id": order.data[0]["id"]}


@router.post("/webhook")
async def razorpay_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature")

    if settings.RAZORPAY_WEBHOOK_SECRET:
        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()

        if signature != expected:
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

    return {"status": "ok"}
