from fastapi import APIRouter, HTTPException, Depends
from app.database import supabase
from app.models.cart import CartItemCreate, CartItemUpdate, CartItemResponse
from app.middleware.auth import get_current_user

router = APIRouter()


@router.get("/")
async def get_cart(user=Depends(get_current_user)):
    items = supabase.table("cart_items").select("*, products(name, base_price, base_pv, images)").eq("user_id", user.id).execute()

    cart_items = []
    for item in items.data:
        product = item.get("products", {})
        price = product.get("base_price", 0)
        pv = product.get("base_pv", 0)

        if item.get("variant_id"):
            variant = supabase.table("product_variants").select("*").eq("id", item["variant_id"]).execute()
            if variant.data:
                price = variant.data[0]["price"]
                pv = variant.data[0]["pv"]

        cart_items.append({
            "id": item["id"],
            "product_id": item["product_id"],
            "variant_id": item.get("variant_id"),
            "quantity": item["quantity"],
            "product_name": product.get("name"),
            "price": price,
            "pv": pv,
            "image": product.get("images", [None])[0] if product.get("images") else None,
        })

    return cart_items


@router.post("/items")
async def add_to_cart(data: CartItemCreate, user=Depends(get_current_user)):
    existing = supabase.table("cart_items").select("*").eq("user_id", user.id).eq("product_id", data.product_id).execute()

    if data.variant_id:
        existing = [i for i in existing.data if i.get("variant_id") == data.variant_id]
    else:
        existing = [i for i in existing.data if not i.get("variant_id")]

    if existing:
        new_qty = existing[0]["quantity"] + data.quantity
        supabase.table("cart_items").update({"quantity": new_qty}).eq("id", existing[0]["id"]).execute()
        return {"message": "Cart updated"}

    cart_data = {
        "user_id": user.id,
        "product_id": data.product_id,
        "variant_id": data.variant_id,
        "quantity": data.quantity,
    }
    supabase.table("cart_items").insert(cart_data).execute()
    return {"message": "Added to cart"}


@router.put("/items/{item_id}")
async def update_cart_item(item_id: str, data: CartItemUpdate, user=Depends(get_current_user)):
    supabase.table("cart_items").update({"quantity": data.quantity}).eq("id", item_id).eq("user_id", user.id).execute()
    return {"message": "Cart updated"}


@router.delete("/items/{item_id}")
async def remove_from_cart(item_id: str, user=Depends(get_current_user)):
    supabase.table("cart_items").delete().eq("id", item_id).eq("user_id", user.id).execute()
    return {"message": "Item removed"}


@router.delete("/")
async def clear_cart(user=Depends(get_current_user)):
    supabase.table("cart_items").delete().eq("user_id", user.id).execute()
    return {"message": "Cart cleared"}
