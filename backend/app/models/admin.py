from pydantic import BaseModel
from typing import Optional
from app.models.auth import UserRole, UserStatus


class AdminUserUpdate(BaseModel):
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None


class AdminDashboardStats(BaseModel):
    total_users: int
    active_distributors: int
    total_orders: int
    total_revenue: float
    pending_withdrawals: float
    total_commissions_paid: float


class OrderStatusUpdate(BaseModel):
    status: str
