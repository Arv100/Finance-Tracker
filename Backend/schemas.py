from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class TransactionType(str, Enum):
    income = "income"
    expense = "expense"


class TransactionStatus(str, Enum):
    completed = "completed"
    pending = "pending"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(
        ..., min_length=6, description="Password must be at least 6 characters long"
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    username: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


# Token Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenRefresh(BaseModel):
    refresh_token: str


# Transaction Schemas
class TransactionBase(BaseModel):
    date: datetime
    description: str
    category: str
    amount: float
    type: TransactionType
    status: TransactionStatus = TransactionStatus.completed
    account: str


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: str
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Dashboard Schemas
class CategoryBreakdown(BaseModel):
    category: str
    amount: float
    percentage: float
    color: str


class MonthlyData(BaseModel):
    month: str
    income: float
    expenses: float


class FinancialSummary(BaseModel):
    total_income: float
    total_expenses: float
    balance: float
    category_summary: List[CategoryBreakdown]
    monthly_data: List[MonthlyData]


class DashboardStats(BaseModel):
    total_balance: float
    monthly_income: float
    monthly_expenses: float
    savings_rate: float
    balance_trend: float
    income_trend: float
    expenses_trend: float
    savings_trend: float


# File Upload Schema
class FileUploadResponse(BaseModel):
    message: str
    processed_count: int
