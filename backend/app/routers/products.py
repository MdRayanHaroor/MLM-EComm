from fastapi import APIRouter, HTTPException, Query, Depends
from app.database import supabase
from app.models.product import ProductCreate, ProductUpdate, ProductResponse, VariantCreate, VariantUpdate, VariantResponse
from app.middleware.auth import require_admin
from typing import Optional

router = APIRouter()


@router.get("/")
async def list_products(
    category_id: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    query = supabase.table("products").select("*, categories(name, slug)").eq("is_active", True)

    if category_id:
        query = query.eq("category_id", category_id)
    if search:
        query = query.ilike("name", f"%{search}%")

    offset = (page - 1) * limit
    response = query.range(offset, offset + limit - 1).execute()

    products = []
    for p in response.data:
        if p.get("has_variants"):
            variants = supabase.table("product_variants").select("*").eq("product_id", p["id"]).eq("is_active", True).execute()
            p["variants"] = variants.data
        products.append(p)

    return {"products": products, "total": len(response.data), "page": page, "limit": limit}


@router.get("/{product_id}")
async def get_product(product_id: str):
    product = supabase.table("products").select("*, categories(name, slug, gst_rate, shipping_rate)").eq("id", product_id).eq("is_active", True).execute()
    if not product.data:
        raise HTTPException(status_code=404, detail="Product not found")

    result = product.data[0]
    if result.get("has_variants"):
        variants = supabase.table("product_variants").select("*").eq("product_id", product_id).eq("is_active", True).execute()
        result["variants"] = variants.data

    return result


@router.post("/", dependencies=[Depends(require_admin)])
async def create_product(data: ProductCreate):
    result = supabase.table("products").insert(data.model_dump()).execute()
    return result.data[0]


@router.put("/{product_id}", dependencies=[Depends(require_admin)])
async def update_product(product_id: str, data: ProductUpdate):
    update_data = data.model_dump(exclude_none=True)
    result = supabase.table("products").update(update_data).eq("id", product_id).execute()
    return result.data[0] if result.data else {"message": "No changes"}


@router.delete("/{product_id}", dependencies=[Depends(require_admin)])
async def delete_product(product_id: str):
    supabase.table("products").update({"is_active": False}).eq("id", product_id).execute()
    return {"message": "Product deactivated"}


@router.get("/{product_id}/variants")
async def get_variants(product_id: str):
    variants = supabase.table("product_variants").select("*").eq("product_id", product_id).eq("is_active", True).execute()
    return variants.data


@router.post("/{product_id}/variants", dependencies=[Depends(require_admin)])
async def create_variant(product_id: str, data: VariantCreate):
    variant_data = data.model_dump()
    variant_data["product_id"] = product_id
    result = supabase.table("product_variants").insert(variant_data).execute()
    return result.data[0]


@router.put("/variants/{variant_id}", dependencies=[Depends(require_admin)])
async def update_variant(variant_id: str, data: VariantUpdate):
    update_data = data.model_dump(exclude_none=True)
    result = supabase.table("product_variants").update(update_data).eq("id", variant_id).execute()
    return result.data[0] if result.data else {"message": "No changes"}


@router.delete("/variants/{variant_id}", dependencies=[Depends(require_admin)])
async def delete_variant(variant_id: str):
    supabase.table("product_variants").update({"is_active": False}).eq("id", variant_id).execute()
    return {"message": "Variant deactivated"}
