from pydantic import BaseModel
from typing import Optional
from enum import Enum


class CartItemCreate(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: str
    product_id: str
    variant_id: Optional[str] = None
    quantity: int
    product_name: Optional[str] = None
    price: Optional[float] = None
    pv: Optional[float] = None
    image: Optional[str] = None
