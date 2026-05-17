from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    DISTRIBUTOR = "distributor"
    CUSTOMER = "customer"


class UserStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    PENDING = "pending"


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    referral_code: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str
    role: UserRole
    referral_code: str
    sponsor_id: Optional[str] = None
    status: UserStatus


class ProfileResponse(BaseModel):
    user_id: str
    pv_balance: float
    current_rank: str
    total_earnings: float
    wallet_balance: float


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
