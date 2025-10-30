from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Add this to your schemas.py file

from enum import Enum
from typing import Optional
from pydantic import BaseModel

# Predefined expense categories
class ExpenseCategory(str, Enum):
    FOOD_DINING = "Food & Dining"
    GROCERIES = "Groceries"
    HOUSING = "Housing"
    RENT_MORTGAGE = "Rent/Mortgage"
    UTILITIES = "Utilities"
    TRANSPORTATION = "Transportation"
    GAS_FUEL = "Gas/Fuel"
    PUBLIC_TRANSPORT = "Public Transport"
    HEALTHCARE = "Healthcare"
    INSURANCE = "Insurance"
    ENTERTAINMENT = "Entertainment"
    SHOPPING = "Shopping"
    CLOTHING = "Clothing"
    PERSONAL_CARE = "Personal Care"
    EDUCATION = "Education"
    TRAVEL = "Travel"
    SUBSCRIPTIONS = "Subscriptions"
    GIFTS_DONATIONS = "Gifts & Donations"
    FEES_CHARGES = "Fees & Charges"
    TAXES = "Taxes"
    OTHER_EXPENSE = "Other Expense"

# Predefined income categories
class IncomeCategory(str, Enum):
    SALARY = "Salary"
    FREELANCE = "Freelance"
    BUSINESS = "Business"
    INVESTMENT = "Investment"
    RENTAL = "Rental Income"
    DIVIDENDS = "Dividends"
    INTEREST = "Interest"
    BONUS = "Bonus"
    GIFT = "Gift"
    REFUND = "Refund"
    OTHER_INCOME = "Other Income"

# Category response model
class CategoryResponse(BaseModel):
    name: str
    type: str  # "income" or "expense"
    icon: Optional[str] = None
    color: Optional[str] = None

    class Config:
        from_attributes = True

# Helper function to get all categories
def get_all_categories():
    expense_categories = [
        {"name": cat.value, "type": "expense", "icon": get_category_icon(cat.value)} 
        for cat in ExpenseCategory
    ]
    income_categories = [
        {"name": cat.value, "type": "income", "icon": get_category_icon(cat.value)} 
        for cat in IncomeCategory
    ]
    return {
        "expense": expense_categories,
        "income": income_categories
    }

def get_category_icon(category: str) -> str:
    """Return icon name for each category (using lucide-react icons)"""
    icons = {
        # Expense categories
        "Food & Dining": "UtensilsCrossed",
        "Groceries": "ShoppingCart",
        "Housing": "Home",
        "Rent/Mortgage": "Key",
        "Utilities": "Zap",
        "Transportation": "Car",
        "Gas/Fuel": "Fuel",
        "Public Transport": "Bus",
        "Healthcare": "Heart",
        "Insurance": "Shield",
        "Entertainment": "Tv",
        "Shopping": "ShoppingBag",
        "Clothing": "Shirt",
        "Personal Care": "Sparkles",
        "Education": "GraduationCap",
        "Travel": "Plane",
        "Subscriptions": "RefreshCw",
        "Gifts & Donations": "Gift",
        "Fees & Charges": "FileText",
        "Taxes": "Calculator",
        "Other Expense": "MoreHorizontal",
        
        # Income categories
        "Salary": "Briefcase",
        "Freelance": "Laptop",
        "Business": "Building",
        "Investment": "TrendingUp",
        "Rental Income": "Building2",
        "Dividends": "PieChart",
        "Interest": "Percent",
        "Bonus": "Award",
        "Gift": "Gift",
        "Refund": "RotateCcw",
        "Other Income": "MoreHorizontal",
    }
    return icons.get(category, "Tag")

def get_category_color(category: str) -> str:
    """Return color for each category"""
    colors = {
        # Expense categories
        "Food & Dining": "hsl(var(--chart-1))",
        "Groceries": "hsl(var(--chart-2))",
        "Housing": "hsl(var(--chart-3))",
        "Rent/Mortgage": "hsl(var(--chart-4))",
        "Utilities": "hsl(var(--chart-5))",
        "Transportation": "#8B5CF6",
        "Gas/Fuel": "#06B6D4",
        "Public Transport": "#10B981",
        "Healthcare": "#EF4444",
        "Insurance": "#F59E0B",
        "Entertainment": "#EC4899",
        "Shopping": "#3B82F6",
        "Clothing": "#8B5CF6",
        "Personal Care": "#D946EF",
        "Education": "#0EA5E9",
        "Travel": "#14B8A6",
        "Subscriptions": "#6366F1",
        "Gifts & Donations": "#F43F5E",
        "Fees & Charges": "#64748B",
        "Taxes": "#71717A",
        "Other Expense": "#9CA3AF",
        
        # Income categories
        "Salary": "#10B981",
        "Freelance": "#3B82F6",
        "Business": "#8B5CF6",
        "Investment": "#06B6D4",
        "Rental Income": "#14B8A6",
        "Dividends": "#0EA5E9",
        "Interest": "#6366F1",
        "Bonus": "#F59E0B",
        "Gift": "#EC4899",
        "Refund": "#10B981",
        "Other Income": "#64748B",
    }
    return colors.get(category, "#9CA3AF")


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
