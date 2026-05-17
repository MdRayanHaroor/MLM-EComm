from pydantic import BaseModel
from typing import Optional
from enum import Enum


class CommissionType(str, Enum):
    DIRECT_REFERRAL = "direct_referral"
    LEVEL_1 = "level_1"
    LEVEL_2 = "level_2"
    LEVEL_3 = "level_3"
    LEVEL_4 = "level_4"


class CommissionStatus(str, Enum):
    PENDING = "pending"
    CREDITED = "credited"
    REVERSED = "reversed"


class CommissionResponse(BaseModel):
    id: str
    user_id: str
    from_order_id: str
    type: str
    amount: float
    pv_earned: float
    status: str
    created_at: str


class CommissionSettingsUpdate(BaseModel):
    direct_referral_percent: float
    level_1_percent: float
    level_2_percent: float
    level_3_percent: float
    level_4_percent: float


class CommissionSettingsResponse(BaseModel):
    direct_referral_percent: float
    level_1_percent: float
    level_2_percent: float
    level_3_percent: float
    level_4_percent: float


class RankSettingsCreate(BaseModel):
    rank_name: str
    required_pv: float
    required_direct_referrals: int
    commission_multiplier: float


class RankSettingsUpdate(BaseModel):
    required_pv: Optional[float] = None
    required_direct_referrals: Optional[int] = None
    commission_multiplier: Optional[float] = None
    is_active: Optional[bool] = None


class RankSettingsResponse(BaseModel):
    id: str
    rank_name: str
    required_pv: float
    required_direct_referrals: int
    commission_multiplier: float
    is_active: bool
