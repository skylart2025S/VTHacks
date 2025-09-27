"""
Plaid integration module for RoomieLoot
Handles bank account linking and transaction fetching
"""

import os
import json
import datetime
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv
import plaid
from plaid.api import plaid_api
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.configuration import Configuration
from plaid import Environment
from fastapi import HTTPException, status

load_dotenv()

class PlaidService:
    """Plaid service for bank account integration"""
    
    def __init__(self):
        """Initialize Plaid client"""
        self.client_id = os.getenv('PLAID_CLIENT_ID')
        self.secret = os.getenv('PLAID_SECRET')
        self.environment = os.getenv('PLAID_ENV', 'sandbox')
        
        if not self.client_id or not self.secret:
            raise ValueError("PLAID_CLIENT_ID and PLAID_SECRET must be set in environment variables")
        
        # Configure Plaid client
        configuration = Configuration(
            host=self._get_environment(),
            api_key={
                'clientId': self.client_id,
                'secret': self.secret,
                'plaidVersion': '2020-09-14'
            }
        )
        
        api_client = plaid.ApiClient(configuration)
        self.client = plaid_api.PlaidApi(api_client)
    
    def _get_environment(self) -> Environment:
        """Get Plaid environment based on configuration"""
        env_map = {
            'sandbox': Environment.Sandbox,
            'development': Environment.Development, 
            'production': Environment.Production
        }
        return env_map.get(self.environment, Environment.Sandbox)
    
    def create_link_token(self, user_id: str) -> Dict[str, Any]:
        """
        Create a Link token for Plaid Link initialization
        
        Args:
            user_id: User ID for the link token
            
        Returns:
            Dict containing link token information
        """
        try:
            request = LinkTokenCreateRequest(
                products=[Products('transactions')],
                client_name="RoomieLoot",
                country_codes=[CountryCode('US')],
                language='en',
                user=LinkTokenCreateRequestUser(
                    client_user_id=user_id
                ),
                webhook='https://your-webhook-url.com/plaid/webhook'  # Set your webhook URL
            )
            
            response = self.client.link_token_create(request)
            return {
                'link_token': response['link_token'],
                'expiration': response['expiration']
            }
            
        except plaid.ApiException as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create link token: {self._format_error(e)}"
            )
    
    def exchange_public_token(self, public_token: str) -> Dict[str, Any]:
        """
        Exchange public token for access token
        
        Args:
            public_token: Public token from Plaid Link
            
        Returns:
            Dict containing access token and item ID
        """
        try:
            request = ItemPublicTokenExchangeRequest(
                public_token=public_token
            )
            response = self.client.item_public_token_exchange(request)
            
            return {
                'access_token': response['access_token'],
                'item_id': response['item_id']
            }
            
        except plaid.ApiException as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to exchange public token: {self._format_error(e)}"
            )
    
    def get_accounts(self, access_token: str) -> Dict[str, Any]:
        """
        Fetch account information and balances
        
        Args:
            access_token: Plaid access token
            
        Returns:
            Dict containing account information
        """
        try:
            request = AccountsGetRequest(access_token=access_token)
            response = self.client.accounts_get(request)
            return response.to_dict()
            
        except plaid.ApiException as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to fetch accounts: {self._format_error(e)}"
            )
    
    def get_transactions(self, access_token: str, days: int = 30) -> Dict[str, Any]:
        """
        Fetch transactions for the specified number of days
        
        Args:
            access_token: Plaid access token
            days: Number of days to fetch transactions for
            
        Returns:
            Dict containing transaction information
        """
        try:
            # Calculate date range
            end_date = datetime.date.today()
            start_date = end_date - datetime.timedelta(days=days)
            
            options = TransactionsGetRequestOptions()
            request = TransactionsGetRequest(
                access_token=access_token,
                start_date=start_date,
                end_date=end_date,
                options=options
            )
            
            response = self.client.transactions_get(request)
            return response.to_dict()
            
        except plaid.ApiException as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to fetch transactions: {self._format_error(e)}"
            )
    
    def _format_error(self, e: plaid.ApiException) -> str:
        """Format Plaid API errors"""
        try:
            response = json.loads(e.body)
            return response.get('error_message', 'Unknown error')
        except:
            return 'Unknown error occurred'

# Global instance
plaid_service = PlaidService()
