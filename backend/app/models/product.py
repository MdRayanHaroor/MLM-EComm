from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryCreate(BaseModel):
    name: str
    slug: str
    parent_id: Optional[str] = None
    gst_rate: float = 18.0
    shipping_rate: float = 50.0


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    gst_rate: Optional[float] = None
    shipping_rate: Optional[float] = None
    is_active: Optional[bool] = None


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    parent_id: Optional[str] = None
    gst_rate: float
    shipping_rate: float
    is_active: bool


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: str
    category_id: str
    base_price: float
    base_mrp: float
    base_pv: float
    has_variants: bool = False
    images: list[str] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    base_price: Optional[float] = None
    base_mrp: Optional[float] = None
    base_pv: Optional[float] = None
    has_variants: Optional[bool] = None
    images: Optional[list[str]] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    category_id: str
    base_price: float
    base_mrp: float
    base_pv: float
    has_variants: bool
    images: list[str]
    is_active: bool


class VariantCreate(BaseModel):
    sku: str
    size: Optional[str] = None
    color: Optional[str] = None
    other_attributes: Optional[dict] = None
    price: float
    mrp: float
    pv: float
    stock_quantity: int


class VariantUpdate(BaseModel):
    sku: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    other_attributes: Optional[dict] = None
    price: Optional[float] = None
    mrp: Optional[float] = None
    pv: Optional[float] = None
    stock_quantity: Optional[int] = None
    is_active: Optional[bool] = None


class VariantResponse(BaseModel):
    id: str
    product_id: str
    sku: str
    size: Optional[str] = None
    color: Optional[str] = None
    other_attributes: Optional[dict] = None
    price: float
    mrp: float
    pv: float
    stock_quantity: int
    is_active: bool
