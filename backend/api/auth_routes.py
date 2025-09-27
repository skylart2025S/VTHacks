"""
Authentication API routes for RoomieLoot
Handles user sign up, login, and authentication
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

from auth.firebase_auth import firebase_auth
from database.database import get_db
from models.user import User

router = APIRouter()
security = HTTPBearer()

# Pydantic models
class UserResponse(BaseModel):
    id: int
    firebase_uid: str
    email: str
    display_name: Optional[str]
    photo_url: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    user: UserResponse
    message: str

class TokenResponse(BaseModel):
    link_token: str
    expiration: str

# Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    try:
        # Verify Firebase token
        user_info = await firebase_auth.verify_token(credentials.credentials)
        
        # Get or create user in database
        user = db.query(User).filter(User.firebase_uid == user_info['uid']).first()
        
        if not user:
            # Create new user
            user = User(
                firebase_uid=user_info['uid'],
                email=user_info['email'],
                display_name=user_info.get('display_name'),
                photo_url=user_info.get('photo_url')
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update existing user info
            user.email = user_info['email']
            user.display_name = user_info.get('display_name')
            user.photo_url = user_info.get('photo_url')
            user.updated_at = datetime.utcnow()
            db.commit()
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/verify", response_model=AuthResponse)
async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Verify Firebase token and return user information
    This endpoint is called after successful Firebase authentication
    """
    try:
        user = await get_current_user(credentials, db)
        
        return AuthResponse(
            user=UserResponse.from_orm(user),
            message="Token verified successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to verify token: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    return UserResponse.from_orm(current_user)

@router.post("/link-token", response_model=TokenResponse)
async def create_link_token(
    current_user: User = Depends(get_current_user)
):
    """
    Create Plaid Link token for bank account connection
    """
    try:
        from services.plaid_service import plaid_service
        
        # Create link token for the user
        link_token_data = plaid_service.create_link_token(str(current_user.id))
        
        return TokenResponse(
            link_token=link_token_data['link_token'],
            expiration=str(link_token_data['expiration'])
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create link token: {str(e)}"
        )

@router.delete("/account")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete user account and all associated data
    """
    try:
        # Delete user from Firebase (this will also delete from database due to cascade)
        await firebase_auth.delete_user(current_user.firebase_uid)
        
        # Delete user from database
        db.delete(current_user)
        db.commit()
        
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete account: {str(e)}"
        )

# Health check for auth service
@router.get("/health")
async def auth_health_check():
    """Health check for authentication service"""
    return {"status": "healthy", "service": "authentication"}
