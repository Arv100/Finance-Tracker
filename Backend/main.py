from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
import io
import uuid
from datetime import datetime, timedelta

# Local imports
from database import get_db, create_tables, User as UserModel, Transaction as TransactionModel
from auth import (
    authenticate_user, create_user, get_current_active_user, 
    create_access_token, create_refresh_token, verify_token,
    get_user_by_email, get_user_by_username, ACCESS_TOKEN_EXPIRE_MINUTES
)
from schemas import (
    UserCreate, UserLogin, UserResponse, UserUpdate, PasswordChange,
    Token, TokenRefresh, TransactionCreate, TransactionUpdate, 
    TransactionResponse, FinancialSummary, DashboardStats, 
    FileUploadResponse, CategoryBreakdown, MonthlyData
)

# Create FastAPI app
app = FastAPI(
    title="FinTrack API",
    description="Personal Finance Tracker API with JWT Authentication",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
def startup_event():
    create_tables()

# Health check
@app.get("/")
async def root():
    return {"message": "FinTrack API v2.0 is running with JWT Authentication"}

# Authentication endpoints
@app.post("/api/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    if get_user_by_email(db, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if get_user_by_username(db, user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    user = create_user(
        db=db,
        email=user_data.email,
        username=user_data.username,
        password=user_data.password,
        full_name=user_data.full_name
    )
    
    return user

@app.post("/api/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT tokens."""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    
    # Create tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@app.post("/api/auth/refresh", response_model=Token)
async def refresh_token(token_data: TokenRefresh, db: Session = Depends(get_db)):
    """Refresh access token using refresh token."""
    payload = verify_token(token_data.refresh_token, "refresh")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    user = db.query(UserModel).filter(UserModel.id == int(user_id)).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserModel = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user

@app.put("/api/auth/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user information."""
    if user_update.email and user_update.email != current_user.email:
        if get_user_by_email(db, user_update.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = user_update.email
    
    if user_update.username and user_update.username != current_user.username:
        if get_user_by_username(db, user_update.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        current_user.username = user_update.username
    
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
    db.commit()
    db.refresh(current_user)
    return current_user

# Transaction endpoints
@app.get("/api/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all transactions for the current user."""
    transactions = db.query(TransactionModel).filter(
        TransactionModel.user_id == current_user.id
    ).order_by(TransactionModel.date.desc()).all()
    return transactions

@app.get("/api/transactions/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: str,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific transaction."""
    transaction = db.query(TransactionModel).filter(
        TransactionModel.id == transaction_id,
        TransactionModel.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    return transaction

@app.post("/api/transactions", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: TransactionCreate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new transaction."""
    transaction = TransactionModel(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        **transaction_data.dict()
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@app.put("/api/transactions/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str,
    transaction_data: TransactionUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a transaction."""
    transaction = db.query(TransactionModel).filter(
        TransactionModel.id == transaction_id,
        TransactionModel.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    for field, value in transaction_data.dict().items():
        setattr(transaction, field, value)
    
    db.commit()
    db.refresh(transaction)
    return transaction

@app.delete("/api/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a transaction."""
    transaction = db.query(TransactionModel).filter(
        TransactionModel.id == transaction_id,
        TransactionModel.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}

# Dashboard endpoints
@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for the current user."""
    transactions = db.query(TransactionModel).filter(
        TransactionModel.user_id == current_user.id
    ).all()
    
    total_income = sum(t.amount for t in transactions if t.type.value == "income")
    total_expenses = sum(t.amount for t in transactions if t.type.value == "expense")
    balance = total_income - total_expenses
    
    # Calculate monthly values (simplified - using all data as current month)
    monthly_income = total_income
    monthly_expenses = total_expenses
    savings_rate = (balance / total_income * 100) if total_income > 0 else 0
    
    return DashboardStats(
        total_balance=balance,
        monthly_income=monthly_income,
        monthly_expenses=monthly_expenses,
        savings_rate=savings_rate,
        balance_trend=12.5,
        income_trend=8.2,
        expenses_trend=-4.1,
        savings_trend=2.3
    )

@app.get("/api/dashboard/summary", response_model=FinancialSummary)
async def get_financial_summary(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get financial summary for the current user."""
    transactions = db.query(TransactionModel).filter(
        TransactionModel.user_id == current_user.id
    ).all()
    
    total_income = sum(t.amount for t in transactions if t.type.value == "income")
    total_expenses = sum(t.amount for t in transactions if t.type.value == "expense")
    balance = total_income - total_expenses
    
    # Calculate category breakdown
    category_totals = {}
    monthly_data_based_on_months = {}
    for transaction in transactions:
        if transaction.date.strftime('%b') not in monthly_data_based_on_months:
            monthly_data_based_on_months[transaction.date.strftime('%b')] = {'expense':[],'income':[]}

        if transaction.amount < 0:
            monthly_data_based_on_months[transaction.date.strftime('%b')]['expense'].append(transaction.amount)
        else:
            monthly_data_based_on_months[transaction.date.strftime('%b')]['income'].append(transaction.amount)

        if transaction.type.value == "expense":
            category = transaction.category
            category_totals[category] = category_totals.get(category, 0) + transaction.amount

    colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))"
    ]
    
    category_summary = []
    for i, (category, amount) in enumerate(category_totals.items()):
        percentage = (abs(amount) / abs(total_expenses) * 100) if abs(total_expenses) > 0 else 0
        category_summary.append(CategoryBreakdown(
            category=category,
            amount=abs(amount),
            percentage=round(percentage, 1),
            color=colors[i % len(colors)]
        ))
    month_data = {'May':5,'Jun':6,'Jul':7}
    monthly_data = []
    sorted_monthly_data_based_on_months = dict(sorted(monthly_data_based_on_months.items(), key=lambda x : month_data[x[0]]))
    print(sorted_monthly_data_based_on_months)
    for month,data in sorted_monthly_data_based_on_months.items():
        monthly_data.append(
            MonthlyData(
                month=month,
                income=sum(data['income']),
                expenses=abs(sum(data['expense']))
            )
        )
    
    return FinancialSummary(
        total_income=total_income,
        total_expenses=total_expenses,
        balance=balance,
        category_summary=category_summary,
        monthly_data=monthly_data
    )

# File upload endpoint
@app.post("/api/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload and process financial data file."""
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV and Excel files are supported"
        )
    
    try:
        contents = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(contents))
        
        # Process the uploaded data
        processed_count = 0
        for _, row in df.iterrows():
            # Map CSV columns to our transaction format
            # This is a simplified mapping - adjust based on actual CSV format
            amount = float(row.get('amount', 0))
            transaction = TransactionModel(
                id=str(uuid.uuid4()),
                user_id=current_user.id,
                date=datetime.now(),  # In production, parse from CSV
                description=str(row.get('description', 'Imported transaction')),
                category=str(row.get('category', 'Other')),
                amount=abs(amount),
                type="expense" if amount < 0 else "income",
                status="completed",
                account=str(row.get('account', 'Imported Account'))
            )
            db.add(transaction)
            processed_count += 1
        
        db.commit()
        
        return FileUploadResponse(
            message=f"Successfully processed {processed_count} transactions",
            processed_count=processed_count
        )
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing file: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)