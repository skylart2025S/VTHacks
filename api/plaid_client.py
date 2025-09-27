#!/usr/bin/env python3
"""
Plaid API Client for RoomieLoot
Fetches financial data similar to sample.json structure
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
from plaid.model.investments_holdings_get_request import InvestmentsHoldingsGetRequest
from plaid.model.investments_transactions_get_request import InvestmentsTransactionsGetRequest
from plaid.model.investments_transactions_get_request_options import InvestmentsTransactionsGetRequestOptions
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.configuration import Configuration
from plaid import Environment

# Load environment variables
load_dotenv()

class PlaidClient:
    """Modern Plaid API client for fetching financial data"""
    
    def __init__(self):
        """Initialize Plaid client with configuration"""
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
        
        # Store access token (in production, store securely in database)
        self.access_token: Optional[str] = None
        self.item_id: Optional[str] = None
    
    def _get_environment(self) -> Environment:
        """Get Plaid environment based on configuration"""
        env_map = {
            'sandbox': Environment.Sandbox,
            'development': Environment.Development, 
            'production': Environment.Production
        }
        return env_map.get(self.environment, Environment.Sandbox)
    
    def create_link_token(self) -> Dict[str, Any]:
        """Create a Link token for Plaid Link initialization"""
        try:
            request = LinkTokenCreateRequest(
                products=[Products('transactions'), Products('investments')],
                client_name="RoomieLoot",
                country_codes=[CountryCode('US')],
                language='en',
                user=LinkTokenCreateRequestUser(
                    client_user_id=str(int(datetime.datetime.now().timestamp()))
                )
            )
            
            response = self.client.link_token_create(request)
            return response.to_dict()
            
        except plaid.ApiException as e:
            return self._format_error(e)
    
    def exchange_public_token(self, public_token: str) -> Dict[str, Any]:
        """Exchange public token for access token"""
        try:
            request = ItemPublicTokenExchangeRequest(
                public_token=public_token
            )
            response = self.client.item_public_token_exchange(request)
            
            self.access_token = response['access_token']
            self.item_id = response['item_id']
            
            return response.to_dict()
            
        except plaid.ApiException as e:
            return self._format_error(e)
    
    def get_accounts(self) -> Dict[str, Any]:
        """Fetch account information and balances"""
        if not self.access_token:
            return {'error': 'No access token available. Please authenticate first.'}
        
        try:
            request = AccountsGetRequest(access_token=self.access_token)
            response = self.client.accounts_get(request)
            return response.to_dict()
            
        except plaid.ApiException as e:
            return self._format_error(e)
    
    def get_transactions(self, days: int = 30) -> Dict[str, Any]:
        """Fetch transactions for the specified number of days"""
        if not self.access_token:
            return {'error': 'No access token available. Please authenticate first.'}
        
        try:
            # Calculate date range
            end_date = datetime.date.today()
            start_date = end_date - datetime.timedelta(days=days)
            
            print(f"📅 Fetching transactions from {start_date} to {end_date}")
            
            options = TransactionsGetRequestOptions()
            request = TransactionsGetRequest(
                access_token=self.access_token,
                start_date=start_date,
                end_date=end_date,
                options=options
            )
            
            response = self.client.transactions_get(request)
            result = response.to_dict()
            
            print(f"📊 API returned {len(result.get('transactions', []))} transactions")
            return result
            
        except plaid.ApiException as e:
            return self._format_error(e)
    
    def get_investment_holdings(self) -> Dict[str, Any]:
        """Fetch investment holdings data"""
        if not self.access_token:
            return {'error': 'No access token available. Please authenticate first.'}
        
        try:
            request = InvestmentsHoldingsGetRequest(access_token=self.access_token)
            response = self.client.investments_holdings_get(request)
            return response.to_dict()
            
        except plaid.ApiException as e:
            return self._format_error(e)
    
    def get_investment_transactions(self, days: int = 30) -> Dict[str, Any]:
        """Fetch investment transactions for the specified number of days"""
        if not self.access_token:
            return {'error': 'No access token available. Please authenticate first.'}
        
        try:
            # Calculate date range
            end_date = datetime.date.today()
            start_date = end_date - datetime.timedelta(days=days)
            
            options = InvestmentsTransactionsGetRequestOptions()
            request = InvestmentsTransactionsGetRequest(
                access_token=self.access_token,
                start_date=start_date,
                end_date=end_date,
                options=options
            )
            
            response = self.client.investments_transactions_get(request)
            return response.to_dict()
            
        except plaid.ApiException as e:
            return self._format_error(e)
    
    def set_access_token(self, access_token: str, item_id: str = None):
        """Set access token for API calls (useful if you already have one)"""
        self.access_token = access_token
        self.item_id = item_id
        print(f"Access token set. Item ID: {item_id}")
    
    def create_sandbox_item(self) -> Dict[str, Any]:
        """Create a sandbox test item using Plaid's official sandbox method"""
        if self.environment != 'sandbox':
            return {'error': 'Sandbox items can only be created in sandbox environment'}
        
        try:
            # Use Plaid's official sandbox method to create a public token
            # This creates a test item with predefined test data
            from plaid.model.sandbox_public_token_create_request import SandboxPublicTokenCreateRequest
            from plaid.model.sandbox_public_token_create_request_options import SandboxPublicTokenCreateRequestOptions
            
            # Create sandbox public token for a test institution
            # Using ins_109508 which is Plaid's test institution with transactions
            request = SandboxPublicTokenCreateRequest(
                institution_id='ins_109508',  # Test institution ID
                initial_products=[Products('transactions'), Products('investments')],
                options=SandboxPublicTokenCreateRequestOptions(
                    webhook='https://webhook.example.com',
                    override_username='user_good',
                    override_password='pass_good'
                )
            )
            
            response = self.client.sandbox_public_token_create(request)
            public_token = response['public_token']
            
            # Exchange public token for access token
            exchange_request = ItemPublicTokenExchangeRequest(
                public_token=public_token
            )
            exchange_response = self.client.item_public_token_exchange(exchange_request)
            
            self.access_token = exchange_response['access_token']
            self.item_id = exchange_response['item_id']
            
            return {
                'access_token': self.access_token,
                'item_id': self.item_id,
                'public_token': public_token,
                'message': 'Sandbox item created successfully'
            }
            
        except plaid.ApiException as e:
            return self._format_error(e)
        except Exception as e:
            return {'error': f'Failed to create sandbox item: {str(e)}'}

    def get_sandbox_data_with_transactions(self) -> Dict[str, Any]:
        """Get sandbox data and ensure it has transactions by using a different approach"""
        if self.environment != 'sandbox':
            return {'error': 'Sandbox test data is only available in sandbox environment'}
        
        try:
            # Create a sandbox item to get access token
            item_result = self.create_sandbox_item()
            
            if 'error' in item_result:
                return item_result
            
            print(f"✅ Sandbox item created: {self.item_id}")
            
            # Get accounts first
            accounts_data = self.get_accounts()
            if 'error' in accounts_data:
                return accounts_data
            
            accounts = accounts_data.get('accounts', [])
            if not accounts:
                return {'error': 'No accounts found'}
            
            # Try to get transactions with a longer date range
            print("🔄 Fetching transactions with extended date range...")
            
            # Wait a moment for the product to be ready
            import time
            time.sleep(2)
            
            transactions_data = self.get_transactions(90)  # Try 90 days instead of 30
            
            # Debug: Check what we actually got
            if 'error' in transactions_data:
                print(f"❌ Error fetching transactions: {transactions_data['error']}")
                # If it's PRODUCT_NOT_READY, wait and try again
                if transactions_data.get('error', {}).get('error_code') == 'PRODUCT_NOT_READY':
                    print("⏳ Product not ready, waiting 5 seconds and retrying...")
                    time.sleep(5)
                    transactions_data = self.get_transactions(90)
                    
                    if 'error' in transactions_data:
                        print(f"❌ Still error after retry: {transactions_data['error']}")
                        transactions_data = {'transactions': []}
                    else:
                        print(f"✅ Found {len(transactions_data.get('transactions', []))} transactions after retry")
            elif not transactions_data.get('transactions'):
                print("ℹ️ No transactions found in sandbox - checking if this is expected")
                # Try with a much longer date range
                print("🔄 Trying with 365 days...")
                transactions_data = self.get_transactions(365)
                if not transactions_data.get('transactions'):
                    print("ℹ️ Still no transactions found")
                    transactions_data = {'transactions': []}
            else:
                print(f"✅ Found {len(transactions_data.get('transactions', []))} transactions")
            
            # Get other data
            holdings_data = self.get_investment_holdings()
            investment_transactions_data = self.get_investment_transactions(30)
            
            # Structure data similar to sample.json
            financial_data = {
                "accounts": accounts,
                "transactions": transactions_data.get('transactions', []),
                "holdings": holdings_data.get('holdings', []),
                "securities": holdings_data.get('securities', []),
                "investment_transactions": investment_transactions_data.get('investment_transactions', []),
                "metadata": {
                    "fetch_date": datetime.datetime.now().isoformat(),
                    "data_source": "plaid_sandbox",
                    "item_id": self.item_id,
                    "total_accounts": len(accounts),
                    "total_transactions": len(transactions_data.get('transactions', [])),
                    "total_holdings": len(holdings_data.get('holdings', []))
                }
            }
            
            return financial_data
            
        except Exception as e:
            return {'error': f'Failed to get sandbox test data: {str(e)}'}


    def get_complete_financial_data(self, days: int = 30) -> Dict[str, Any]:
        """Fetch all financial data similar to sample.json structure"""
        if not self.access_token:
            return {'error': 'No access token available. Please authenticate first.'}
        
        try:
            # Fetch all data in parallel
            accounts_data = self.get_accounts()
            transactions_data = self.get_transactions(days)
            holdings_data = self.get_investment_holdings()
            investment_transactions_data = self.get_investment_transactions(days)
            
            # Structure data similar to sample.json
            financial_data = {
                "accounts": accounts_data.get('accounts', []),
                "transactions": transactions_data.get('transactions', []),
                "holdings": holdings_data.get('holdings', []),
                "securities": holdings_data.get('securities', []),
                "investment_transactions": investment_transactions_data.get('investment_transactions', []),
                "metadata": {
                    "fetch_date": datetime.datetime.now().isoformat(),
                    "days_requested": days,
                    "item_id": self.item_id,
                    "total_accounts": len(accounts_data.get('accounts', [])),
                    "total_transactions": len(transactions_data.get('transactions', [])),
                    "total_holdings": len(holdings_data.get('holdings', []))
                }
            }
            
            return financial_data
            
        except Exception as e:
            return {'error': f'Failed to fetch complete financial data: {str(e)}'}
    
    def _format_error(self, e: plaid.ApiException) -> Dict[str, Any]:
        """Format Plaid API errors"""
        try:
            response = json.loads(e.body)
            return {
                'error': {
                    'status_code': e.status,
                    'display_message': response.get('error_message', 'Unknown error'),
                    'error_code': response.get('error_code', ''),
                    'error_type': response.get('error_type', '')
                }
            }
        except:
            return {
                'error': {
                    'status_code': e.status,
                    'display_message': 'Unknown error occurred',
                    'error_code': '',
                    'error_type': ''
                }
            }
    
    def save_data_to_file(self, data: Dict[str, Any], filename: str = 'financial_data.json'):
        """Save financial data to JSON file"""
        try:
            with open(filename, 'w') as f:
                json.dump(data, f, indent=2, default=str)
            print(f"Data saved to {filename}")
        except Exception as e:
            print(f"Error saving data: {e}")


def main():
    """Main function to demonstrate Plaid client usage"""
    print("Plaid API Client for RoomieLoot")
    print("=" * 40)
    
    try:
        # Initialize client
        plaid_client = PlaidClient()
        
        print(f"\nEnvironment: {plaid_client.environment}")
        print(f"Client ID: {plaid_client.client_id[:8]}..." if plaid_client.client_id else "Client ID: Not set")
        
        # Option 1: Get sandbox test data (no Link required)
        print("\n1. Getting Sandbox Test Data...")
        test_data = plaid_client.get_sandbox_test_data()
        
        if 'error' in test_data:
            print(f"Error: {test_data['error']}")
        else:
            print("✅ Sandbox test data retrieved successfully!")
            print(f"   Accounts: {len(test_data['accounts'])}")
            print(f"   Transactions: {len(test_data['transactions'])}")
            print(f"   Holdings: {len(test_data['holdings'])}")
            
            # Save test data to file
            plaid_client.save_data_to_file(test_data, 'sandbox_test_data.json')
        
        # Option 2: Create Link token for real data
        print("\n2. Creating Link Token for Real Data...")
        link_token_response = plaid_client.create_link_token()
        
        if 'error' in link_token_response:
            print(f"Error creating link token: {link_token_response['error']}")
        else:
            print(f"✅ Link token created: {link_token_response.get('link_token', 'N/A')}")
        
        # Option 3: Show how to use with existing access token
        print("\n3. Using with Existing Access Token:")
        print("   If you already have an access token from a previous Link flow:")
        print("   client.set_access_token('your_access_token', 'your_item_id')")
        print("   data = client.get_complete_financial_data()")
        
        print("\n" + "="*50)
        print("USAGE OPTIONS")
        print("="*50)
        print("1. Test Data (No Auth): client.get_sandbox_test_data()")
        print("2. Real Data (Link Flow): Use link_token with Plaid Link")
        print("3. Existing Token: client.set_access_token(token, item_id)")
        
    except Exception as e:
        print(f"Error initializing Plaid client: {e}")
        print("\nMake sure you have:")
        print("1. PLAID_CLIENT_ID and PLAID_SECRET in your .env file")
        print("2. Installed required packages: pip install plaid-python python-dotenv")


if __name__ == "__main__":
    main()
