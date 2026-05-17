from pydantic import BaseModel
from typing import Optional
from enum import Enum


class WithdrawalMethod(str, Enum):
    BANK_TRANSFER = "bank_transfer"
    UPI = "upi"


class WithdrawalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"


class WithdrawalRequest(BaseModel):
    amount: float
    method: WithdrawalMethod
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    ifsc_code: Optional[str] = None
    upi_id: Optional[str] = None


class WithdrawalResponse(BaseModel):
    id: str
    user_id: str
    amount: float
    method: str
    status: str
    requested_at: str


class WalletTransactionResponse(BaseModel):
    id: str
    type: str
    amount: float
    balance_before: float
    balance_after: float
    reference_id: Optional[str] = None
    status: str
    created_at: str


class WalletBalanceResponse(BaseModel):
    wallet_balance: float
    total_earnings: float
    pending_withdrawals: float
