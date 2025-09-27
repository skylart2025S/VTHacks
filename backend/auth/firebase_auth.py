"""
Firebase Authentication module for RoomieLoot
Handles user authentication with Firebase Auth and Google OAuth
"""

import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class FirebaseAuth:
    """Firebase Authentication handler"""
    
    def __init__(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if Firebase is already initialized
            if not firebase_admin._apps:
                # Initialize Firebase Admin SDK
                # In production, use service account key file
                # For development, you can use environment variables
                if os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"):
                    # Load from environment variable (JSON string)
                    import json
                    service_account_info = json.loads(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"))
                    cred = credentials.Certificate(service_account_info)
                elif os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH"):
                    # Load from file path
                    cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH"))
                else:
                    # For development - you'll need to set up Firebase project
                    raise ValueError("Firebase service account not configured")
                
                firebase_admin.initialize_app(cred)
            
            self.auth = auth
            print("✅ Firebase Admin SDK initialized successfully")
            
        except Exception as e:
            print(f"❌ Failed to initialize Firebase Admin SDK: {e}")
            print("Please set up Firebase project and service account")
            raise
    
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify Firebase ID token and return user info
        
        Args:
            token: Firebase ID token from client
            
        Returns:
            Dict containing user information
            
        Raises:
            HTTPException: If token is invalid
        """
        try:
            # Verify the ID token
            decoded_token = self.auth.verify_id_token(token)
            
            # Get user info from Firebase
            uid = decoded_token['uid']
            user_record = self.auth.get_user(uid)
            
            return {
                'uid': uid,
                'email': user_record.email,
                'display_name': user_record.display_name,
                'photo_url': user_record.photo_url,
                'email_verified': user_record.email_verified,
                'custom_claims': decoded_token.get('custom_claims', {}),
                'firebase_claims': decoded_token
            }
            
        except self.auth.InvalidIdTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase ID token"
            )
        except self.auth.ExpiredIdTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Firebase ID token has expired"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token verification failed: {str(e)}"
            )
    
    async def get_user_by_uid(self, uid: str) -> Optional[Dict[str, Any]]:
        """
        Get user information by Firebase UID
        
        Args:
            uid: Firebase user UID
            
        Returns:
            Dict containing user information or None if not found
        """
        try:
            user_record = self.auth.get_user(uid)
            return {
                'uid': uid,
                'email': user_record.email,
                'display_name': user_record.display_name,
                'photo_url': user_record.photo_url,
                'email_verified': user_record.email_verified,
                'created_at': user_record.user_metadata.creation_timestamp,
                'last_sign_in': user_record.user_metadata.last_sign_in_timestamp
            }
        except self.auth.UserNotFoundError:
            return None
        except Exception as e:
            print(f"Error getting user by UID: {e}")
            return None
    
    async def create_custom_token(self, uid: str, additional_claims: Optional[Dict] = None) -> str:
        """
        Create a custom token for a user
        
        Args:
            uid: Firebase user UID
            additional_claims: Additional custom claims to include
            
        Returns:
            Custom token string
        """
        try:
            return self.auth.create_custom_token(uid, additional_claims)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create custom token: {str(e)}"
            )
    
    async def set_custom_user_claims(self, uid: str, custom_claims: Dict[str, Any]) -> bool:
        """
        Set custom claims for a user
        
        Args:
            uid: Firebase user UID
            custom_claims: Custom claims to set
            
        Returns:
            True if successful, False otherwise
        """
        try:
            self.auth.set_custom_user_claims(uid, custom_claims)
            return True
        except Exception as e:
            print(f"Error setting custom claims: {e}")
            return False
    
    async def delete_user(self, uid: str) -> bool:
        """
        Delete a user from Firebase Auth
        
        Args:
            uid: Firebase user UID
            
        Returns:
            True if successful, False otherwise
        """
        try:
            self.auth.delete_user(uid)
            return True
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False

# Global instance
firebase_auth = FirebaseAuth()