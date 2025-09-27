"""
Bank account API routes for RoomieLoot
Handles bank account linking and management
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

from auth.firebase_auth import firebase_auth
from database.database import get_db
from models.user import User, BankAccount
from api.auth_routes import get_current_user

router = APIRouter()

# Pydantic models
class BankAccountResponse(BaseModel):
    id: int
    plaid_item_id: str
    institution_id: Optional[str]
    institution_name: Optional[str]
    account_id: str
    account_name: Optional[str]
    account_type: Optional[str]
    account_subtype: Optional[str]
    current_balance: Optional[float]
    available_balance: Optional[float]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class LinkBankAccountRequest(BaseModel):
    public_token: str

class LinkBankAccountResponse(BaseModel):
    message: str
    bank_accounts: List[BankAccountResponse]

@router.post("/link", response_model=LinkBankAccountResponse)
async def link_bank_account(
    request: LinkBankAccountRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Link a bank account using Plaid public token
    """
    try:
        from services.plaid_service import plaid_service
        
        # Exchange public token for access token
        exchange_result = plaid_service.exchange_public_token(request.public_token)
        access_token = exchange_result['access_token']
        item_id = exchange_result['item_id']
        
        # Get account information from Plaid
        accounts_data = plaid_service.get_accounts(access_token)
        accounts = accounts_data.get('accounts', [])
        
        if not accounts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No accounts found for this item"
            )
        
        # Check if this item is already linked
        existing_item = db.query(BankAccount).filter(
            BankAccount.plaid_item_id == item_id
        ).first()
        
        if existing_item:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This bank account is already linked"
            )
        
        # Create bank account records
        bank_accounts = []
        for account in accounts:
            bank_account = BankAccount(
                user_id=current_user.id,
                plaid_item_id=item_id,
                plaid_access_token=access_token,
                institution_id=accounts_data.get('item', {}).get('institution_id'),
                institution_name=accounts_data.get('item', {}).get('institution_name'),
                account_id=account['account_id'],
                account_name=account.get('name'),
                account_type=account.get('type'),
                account_subtype=account.get('subtype'),
                current_balance=account.get('balances', {}).get('current'),
                available_balance=account.get('balances', {}).get('available'),
                is_active=True
            )
            db.add(bank_account)
            bank_accounts.append(bank_account)
        
        db.commit()
        
        # Refresh to get IDs
        for account in bank_accounts:
            db.refresh(account)
        
        return LinkBankAccountResponse(
            message="Bank account linked successfully",
            bank_accounts=[BankAccountResponse.from_orm(account) for account in bank_accounts]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to link bank account: {str(e)}"
        )

@router.get("/accounts", response_model=List[BankAccountResponse])
async def get_bank_accounts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all linked bank accounts for the current user
    """
    try:
        bank_accounts = db.query(BankAccount).filter(
            BankAccount.user_id == current_user.id,
            BankAccount.is_active == True
        ).all()
        
        return [BankAccountResponse.from_orm(account) for account in bank_accounts]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get bank accounts: {str(e)}"
        )

@router.get("/accounts/{account_id}", response_model=BankAccountResponse)
async def get_bank_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get specific bank account details
    """
    try:
        bank_account = db.query(BankAccount).filter(
            BankAccount.id == account_id,
            BankAccount.user_id == current_user.id,
            BankAccount.is_active == True
        ).first()
        
        if not bank_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bank account not found"
            )
        
        return BankAccountResponse.from_orm(bank_account)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get bank account: {str(e)}"
        )

@router.put("/accounts/{account_id}/refresh")
async def refresh_bank_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Refresh bank account data from Plaid
    """
    try:
        from services.plaid_service import plaid_service
        
        bank_account = db.query(BankAccount).filter(
            BankAccount.id == account_id,
            BankAccount.user_id == current_user.id,
            BankAccount.is_active == True
        ).first()
        
        if not bank_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bank account not found"
            )
        
        # Get updated account data from Plaid
        accounts_data = plaid_service.get_accounts(bank_account.plaid_access_token)
        accounts = accounts_data.get('accounts', [])
        
        # Find the matching account
        matching_account = None
        for account in accounts:
            if account['account_id'] == bank_account.account_id:
                matching_account = account
                break
        
        if not matching_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found in Plaid"
            )
        
        # Update account data
        bank_account.current_balance = matching_account.get('balances', {}).get('current')
        bank_account.available_balance = matching_account.get('balances', {}).get('available')
        bank_account.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "message": "Bank account refreshed successfully",
            "account": BankAccountResponse.from_orm(bank_account)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to refresh bank account: {str(e)}"
        )

@router.delete("/accounts/{account_id}")
async def unlink_bank_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Unlink a bank account
    """
    try:
        bank_account = db.query(BankAccount).filter(
            BankAccount.id == account_id,
            BankAccount.user_id == current_user.id
        ).first()
        
        if not bank_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bank account not found"
            )
        
        # Mark as inactive instead of deleting to preserve transaction history
        bank_account.is_active = False
        bank_account.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {"message": "Bank account unlinked successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to unlink bank account: {str(e)}"
        )

# Health check for bank service
@router.get("/health")
async def bank_health_check():
    """Health check for bank service"""
    return {"status": "healthy", "service": "bank_accounts"}
