from pydantic import BaseModel
from typing import Optional
from enum import Enum


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    RETURNED = "returned"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class OrderItemInput(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int


class OrderCreate(BaseModel):
    shipping_address_id: str
    items: list[OrderItemInput]


class OrderResponse(BaseModel):
    id: str
    order_number: str
    user_id: str
    subtotal: float
    gst_amount: float
    shipping_amount: float
    total_amount: float
    status: OrderStatus
    payment_status: PaymentStatus
    created_at: str


class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    variant_id: Optional[str] = None
    quantity: int
    unit_price: float
    mrp: float
    pv: float
    gst_rate: float
    gst_amount: float
    total: float
    variant_details: Optional[dict] = None


class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    is_default: bool = False


class AddressUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    is_default: Optional[bool] = None


class AddressResponse(BaseModel):
    id: str
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    is_default: bool
