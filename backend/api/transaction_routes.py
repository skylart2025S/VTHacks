"""
Transaction API routes for RoomieLoot
Handles transaction fetching, categorization, and management
"""

from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, date

from auth.firebase_auth import firebase_auth
from database.database import get_db
from models.user import User, BankAccount, Transaction
from api.auth_routes import get_current_user

router = APIRouter()

# Pydantic models
class TransactionResponse(BaseModel):
    id: int
    plaid_transaction_id: str
    amount: float
    merchant_name: Optional[str]
    transaction_name: Optional[str]
    transaction_type: Optional[str]
    category: Optional[str]
    subcategory: Optional[str]
    date: datetime
    account_id: str
    is_pending: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TransactionSummary(BaseModel):
    total_transactions: int
    total_amount: float
    category_totals: Dict[str, float]
    category_counts: Dict[str, int]
    date_range: Dict[str, str]

class FetchTransactionsRequest(BaseModel):
    account_id: Optional[int] = None
    days: int = 30

@router.post("/fetch", response_model=List[TransactionResponse])
async def fetch_transactions(
    request: FetchTransactionsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch transactions from Plaid and store them in the database
    """
    try:
        from services.plaid_service import plaid_service
        from services.transaction_categorizer import transaction_categorizer
        
        # Get bank accounts to fetch from
        if request.account_id:
            # Fetch from specific account
            bank_account = db.query(BankAccount).filter(
                BankAccount.id == request.account_id,
                BankAccount.user_id == current_user.id,
                BankAccount.is_active == True
            ).first()
            
            if not bank_account:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Bank account not found"
                )
            
            bank_accounts = [bank_account]
        else:
            # Fetch from all active accounts
            bank_accounts = db.query(BankAccount).filter(
                BankAccount.user_id == current_user.id,
                BankAccount.is_active == True
            ).all()
        
        if not bank_accounts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No active bank accounts found"
            )
        
        all_transactions = []
        
        # Fetch transactions from each account
        for bank_account in bank_accounts:
            try:
                # Get transactions from Plaid
                transactions_data = plaid_service.get_transactions(
                    bank_account.plaid_access_token, 
                    request.days
                )
                
                transactions = transactions_data.get('transactions', [])
                
                # Categorize transactions
                categorized_transactions = transaction_categorizer.categorize_transactions(transactions)
                
                # Store transactions in database
                for transaction_data in categorized_transactions:
                    # Check if transaction already exists
                    existing_transaction = db.query(Transaction).filter(
                        Transaction.plaid_transaction_id == transaction_data['transaction_id']
                    ).first()
                    
                    if not existing_transaction:
                        # Create new transaction record
                        transaction = Transaction(
                            user_id=current_user.id,
                            bank_account_id=bank_account.id,
                            plaid_transaction_id=transaction_data['transaction_id'],
                            amount=transaction_data['amount'],
                            merchant_name=transaction_data.get('merchant_name'),
                            transaction_name=transaction_data.get('name'),
                            transaction_type=transaction_data.get('transaction_type'),
                            category=transaction_data.get('category'),
                            subcategory=transaction_data.get('subcategory'),
                            date=datetime.fromisoformat(transaction_data['date'].replace('Z', '+00:00')),
                            account_id=transaction_data['account_id'],
                            is_pending=transaction_data.get('pending', False)
                        )
                        db.add(transaction)
                        all_transactions.append(transaction)
                
            except Exception as e:
                print(f"Error fetching transactions for account {bank_account.id}: {e}")
                continue
        
        db.commit()
        
        # Refresh to get IDs
        for transaction in all_transactions:
            db.refresh(transaction)
        
        return [TransactionResponse.from_orm(transaction) for transaction in all_transactions]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch transactions: {str(e)}"
        )

@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    account_id: Optional[int] = Query(None, description="Filter by bank account ID"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, description="Number of transactions to return"),
    offset: int = Query(0, description="Number of transactions to skip"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get transactions for the current user with optional filtering
    """
    try:
        query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
        
        if account_id:
            query = query.filter(Transaction.bank_account_id == account_id)
        
        if category:
            query = query.filter(Transaction.category == category)
        
        transactions = query.order_by(Transaction.date.desc()).offset(offset).limit(limit).all()
        
        return [TransactionResponse.from_orm(transaction) for transaction in transactions]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get transactions: {str(e)}"
        )

@router.get("/summary", response_model=TransactionSummary)
async def get_transaction_summary(
    account_id: Optional[int] = Query(None, description="Filter by bank account ID"),
    days: int = Query(30, description="Number of days to include"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get transaction summary with category breakdown
    """
    try:
        from services.transaction_categorizer import transaction_categorizer
        
        # Calculate date range
        end_date = date.today()
        start_date = end_date.replace(day=1)  # Start of current month
        
        query = db.query(Transaction).filter(
            Transaction.user_id == current_user.id,
            Transaction.date >= start_date,
            Transaction.date <= end_date
        )
        
        if account_id:
            query = query.filter(Transaction.bank_account_id == account_id)
        
        transactions = query.all()
        
        # Convert to dict format for categorizer
        transaction_dicts = []
        for transaction in transactions:
            transaction_dicts.append({
                'amount': transaction.amount,
                'merchant_name': transaction.merchant_name,
                'name': transaction.transaction_name,
                'category': transaction.category
            })
        
        # Get category summary
        summary = transaction_categorizer.get_category_summary(transaction_dicts)
        
        return TransactionSummary(
            total_transactions=summary['total_transactions'],
            total_amount=summary['total_amount'],
            category_totals=summary['category_totals'],
            category_counts=summary['category_counts'],
            date_range={
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get transaction summary: {str(e)}"
        )

@router.get("/categories")
async def get_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all unique categories for the user's transactions
    """
    try:
        categories = db.query(Transaction.category).filter(
            Transaction.user_id == current_user.id,
            Transaction.category.isnot(None)
        ).distinct().all()
        
        return [category[0] for category in categories]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get categories: {str(e)}"
        )

@router.put("/{transaction_id}/category")
async def update_transaction_category(
    transaction_id: int,
    category: str,
    subcategory: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update transaction category manually
    """
    try:
        transaction = db.query(Transaction).filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id
        ).first()
        
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        transaction.category = category
        transaction.subcategory = subcategory
        transaction.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "message": "Transaction category updated successfully",
            "transaction": TransactionResponse.from_orm(transaction)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update transaction category: {str(e)}"
        )

# Health check for transaction service
@router.get("/health")
async def transaction_health_check():
    """Health check for transaction service"""
    return {"status": "healthy", "service": "transactions"}
