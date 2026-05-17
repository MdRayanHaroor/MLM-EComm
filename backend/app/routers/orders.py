from fastapi import APIRouter, HTTPException, Depends
from app.database import supabase
from app.models.order import OrderCreate, OrderResponse, AddressCreate, AddressUpdate
from app.middleware.auth import get_current_user, require_admin
import uuid
from datetime import datetime

router = APIRouter()


@router.post("/")
async def create_order(data: OrderCreate, user=Depends(get_current_user)):
    cart_items = supabase.table("cart_items").select("*, products(base_price, base_pv, base_mrp)").eq("user_id", user.id).execute()

    if not cart_items.data:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = 0
    gst_total = 0
    shipping_total = 0
    total_pv = 0
    order_items = []

    for item in cart_items.data:
        product = item.get("products", {})
        price = product.get("base_price", 0)
        pv = product.get("base_pv", 0)
        mrp = product.get("base_mrp", 0)

        variant_details = None
        if item.get("variant_id"):
            variant = supabase.table("product_variants").select("*").eq("id", item["variant_id"]).execute()
            if variant.data:
                v = variant.data[0]
                price = v["price"]
                pv = v["pv"]
                mrp = v["mrp"]
                variant_details = {"size": v.get("size"), "color": v.get("color"), "other_attributes": v.get("other_attributes")}

        product_detail = supabase.table("products").select("category_id").eq("id", item["product_id"]).execute()
        category_id = product_detail.data[0]["category_id"] if product_detail.data else None

        gst_rate = 18
        shipping_rate = 50
        if category_id:
            cat = supabase.table("categories").select("gst_rate, shipping_rate").eq("id", category_id).execute()
            if cat.data:
                gst_rate = cat.data[0]["gst_rate"]
                shipping_rate = cat.data[0]["shipping_rate"]

        line_total = price * item["quantity"]
        gst_amount = round(line_total * (gst_rate / 100), 2)

        subtotal += line_total
        gst_total += gst_amount
        shipping_total += shipping_rate
        total_pv += pv * item["quantity"]

        order_items.append({
            "product_id": item["product_id"],
            "variant_id": item.get("variant_id"),
            "quantity": item["quantity"],
            "unit_price": price,
            "mrp": mrp,
            "pv": pv,
            "gst_rate": gst_rate,
            "gst_amount": gst_amount,
            "total": line_total + gst_amount,
            "variant_details": variant_details,
        })

        stock_check = supabase.table("product_variants").select("stock_quantity").eq("id", item["variant_id"]).execute() if item.get("variant_id") else None
        if stock_check and stock_check.data:
            if stock_check.data[0]["stock_quantity"] < item["quantity"]:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for product {item['product_id']}")
            supabase.table("product_variants").update({"stock_quantity": stock_check.data[0]["stock_quantity"] - item["quantity"]}).eq("id", item["variant_id"]).execute()

    total_amount = subtotal + gst_total + shipping_total
    order_number = f"MLM{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:6].upper()}"

    order_data = {
        "user_id": user.id,
        "order_number": order_number,
        "subtotal": subtotal,
        "gst_amount": gst_total,
        "shipping_amount": shipping_total,
        "total_amount": total_amount,
        "status": "pending",
        "payment_status": "pending",
        "shipping_address_id": data.shipping_address_id,
    }

    order_result = supabase.table("orders").insert(order_data).execute()
    order_id = order_result.data[0]["id"]

    for oi in order_items:
        oi["order_id"] = order_id
        supabase.table("order_items").insert(oi).execute()

    supabase.table("cart_items").delete().eq("user_id", user.id).execute()

    return {"order_id": order_id, "order_number": order_number, "total_amount": total_amount}


@router.get("/")
async def get_orders(user=Depends(get_current_user)):
    orders = supabase.table("orders").select("*").eq("user_id", user.id).order("created_at", desc=True).execute()
    return orders.data


@router.get("/{order_id}")
async def get_order(order_id: str, user=Depends(get_current_user)):
    order = supabase.table("orders").select("*").eq("id", order_id).eq("user_id", user.id).execute()
    if not order.data:
        raise HTTPException(status_code=404, detail="Order not found")

    items = supabase.table("order_items").select("*").eq("order_id", order_id).execute()
    return {"order": order.data[0], "items": items.data}


@router.post("/{order_id}/cancel")
async def cancel_order(order_id: str, user=Depends(get_current_user)):
    order = supabase.table("orders").select("*").eq("id", order_id).eq("user_id", user.id).execute()
    if not order.data:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.data[0]["status"] in ["shipped", "delivered", "cancelled"]:
        raise HTTPException(status_code=400, detail="Cannot cancel this order")

    supabase.table("orders").update({"status": "cancelled"}).eq("id", order_id).execute()

    if order.data[0]["payment_status"] == "paid":
        from app.services.commission import reverse_commissions_for_order
        reverse_commissions_for_order(order_id)

    return {"message": "Order cancelled"}


@router.get("/admin", dependencies=[Depends(require_admin)])
async def get_all_orders():
    orders = supabase.table("orders").select("*").order("created_at", desc=True).execute()
    return orders.data


@router.put("/{order_id}/status", dependencies=[Depends(require_admin)])
async def update_order_status(order_id: str, status_data: dict):
    supabase.table("orders").update({"status": status_data["status"]}).eq("id", order_id).execute()
    return {"message": "Order status updated"}


@router.post("/addresses")
async def create_address(data: AddressCreate, user=Depends(get_current_user)):
    address_data = data.model_dump()
    address_data["user_id"] = user.id

    if data.is_default:
        supabase.table("addresses").update({"is_default": False}).eq("user_id", user.id).execute()

    result = supabase.table("addresses").insert(address_data).execute()
    return result.data[0]


@router.get("/addresses")
async def get_addresses(user=Depends(get_current_user)):
    addresses = supabase.table("addresses").select("*").eq("user_id", user.id).execute()
    return addresses.data


@router.put("/addresses/{address_id}")
async def update_address(address_id: str, data: AddressUpdate, user=Depends(get_current_user)):
    update_data = data.model_dump(exclude_none=True)
    if data.is_default:
        supabase.table("addresses").update({"is_default": False}).eq("user_id", user.id).execute()
    result = supabase.table("addresses").update(update_data).eq("id", address_id).eq("user_id", user.id).execute()
    return result.data[0] if result.data else {"message": "No changes"}


@router.delete("/addresses/{address_id}")
async def delete_address(address_id: str, user=Depends(get_current_user)):
    supabase.table("addresses").delete().eq("id", address_id).eq("user_id", user.id).execute()
    return {"message": "Address deleted"}
