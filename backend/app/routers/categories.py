from fastapi import APIRouter, HTTPException, Depends
from app.database import supabase
from app.models.product import CategoryCreate, CategoryUpdate, CategoryResponse
from app.middleware.auth import require_admin

router = APIRouter()


@router.get("/")
async def list_categories():
    categories = supabase.table("categories").select("*").eq("is_active", True).execute()
    return categories.data


@router.post("/", dependencies=[Depends(require_admin)])
async def create_category(data: CategoryCreate):
    existing = supabase.table("categories").select("id").eq("slug", data.slug).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Category slug already exists")
    result = supabase.table("categories").insert(data.model_dump()).execute()
    return result.data[0]


@router.put("/{category_id}", dependencies=[Depends(require_admin)])
async def update_category(category_id: str, data: CategoryUpdate):
    update_data = data.model_dump(exclude_none=True)
    result = supabase.table("categories").update(update_data).eq("id", category_id).execute()
    return result.data[0] if result.data else {"message": "No changes"}


@router.delete("/{category_id}", dependencies=[Depends(require_admin)])
async def delete_category(category_id: str):
    supabase.table("categories").update({"is_active": False}).eq("id", category_id).execute()
    return {"message": "Category deactivated"}
