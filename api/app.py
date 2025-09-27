"""
RoomieLoot - Gamified Personal Finance App Backend
Flask application with Plaid API integration for financial data and gamification features.
"""

import os
import json
import time
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from plaid.model.accounts_balance_get_request import AccountsBalanceGetRequest
from plaid.model.identity_get_request import IdentityGetRequest
from plaid.model.investments_holdings_get_request import InvestmentsHoldingsGetRequest
from plaid.model.investments_transactions_get_request import InvestmentsTransactionsGetRequest
from plaid.model.investments_transactions_get_request_options import InvestmentsTransactionsGetRequestOptions
from plaid.model.item_get_request import ItemGetRequest
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
from plaid.model.asset_report_create_request import AssetReportCreateRequest
from plaid.model.asset_report_create_request_options import AssetReportCreateRequestOptions
from plaid.model.asset_report_user import AssetReportUser
from plaid.model.asset_report_get_request import AssetReportGetRequest
from plaid.model.asset_report_pdf_get_request import AssetReportPDFGetRequest
from plaid.model.payment_initiation_recipient_create_request import PaymentInitiationRecipientCreateRequest
from plaid.model.numbers_bacs_nullable import NumbersBACSNullable
from plaid.model.payment_initiation_address import PaymentInitiationAddress
from plaid.model.payment_initiation_payment_create_request import PaymentInitiationPaymentCreateRequest
from plaid.model.payment_amount import PaymentAmount
from plaid.model.link_token_create_request_payment_initiation import LinkTokenCreateRequestPaymentInitiation
from plaid.model.payment_initiation_payment_get_request import PaymentInitiationPaymentGetRequest
from plaid.model.transfer_authorization_create_request import TransferAuthorizationCreateRequest
from plaid.model.transfer_type import TransferType
from plaid.model.transfer_network import TransferNetwork
from plaid.model.ach_class import ACHClass
from plaid.model.transfer_user_in_request import TransferUserInRequest
from plaid.model.transfer_user_address_in_request import TransferUserAddressInRequest
from plaid.model.transfer_create_request import TransferCreateRequest
from plaid.model.transfer_create_idempotency_key import TransferCreateIdempotencyKey
from plaid.model.transfer_get_request import TransferGetRequest
from plaid.exceptions import ApiException

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Plaid Configuration
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')
PLAID_COUNTRY_CODES = os.getenv('PLAID_COUNTRY_CODES', 'US').split(',')
PLAID_REDIRECT_URI = os.getenv('PLAID_REDIRECT_URI')

# Set up Plaid environment
if PLAID_ENV == 'sandbox':
    host = plaid.Environment.Sandbox
elif PLAID_ENV == 'development':
    host = plaid.Environment.Development
elif PLAID_ENV == 'production':
    host = plaid.Environment.Production
else:
    host = plaid.Environment.Sandbox

# Configure Plaid client
configuration = plaid.Configuration(
    host=host,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
        'plaidVersion': '2020-09-14'
    }
)

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

# Convert products string to Plaid Products objects
products = []
for product in PLAID_PRODUCTS:
    products.append(Products(product))

# In-memory storage (replace with database in production)
access_tokens = {}  # Store multiple access tokens per user
user_data = {}  # Store user financial data and gamification data

# Utility Functions
def empty_to_none(field):
    """Check if environment variable is empty or None"""
    value = os.getenv(field)
    if value is None or len(value) == 0:
        return None
    return value

def pretty_print_response(response):
    """Pretty print JSON response for debugging"""
    print(json.dumps(response, indent=2, sort_keys=True, default=str))

def format_error(e):
    """Format Plaid API errors"""
    response = json.loads(e.body)
    return {
        'error': {
            'status_code': e.status,
            'display_message': response['error_message'],
            'error_code': response['error_code'],
            'error_type': response['error_type']
        }
    }

def calculate_xp_from_transaction(transaction):
    """Calculate XP based on transaction data"""
    amount = abs(float(transaction.get('amount', 0)))
    
    # Base XP calculation
    if amount > 0:
        # Spending transactions give XP based on amount
        base_xp = min(int(amount * 0.1), 50)  # Max 50 XP per transaction
        
        # Bonus XP for different categories
        category = transaction.get('category', [])
        if 'food' in str(category).lower():
            base_xp += 5
        elif 'entertainment' in str(category).lower():
            base_xp += 3
        elif 'transportation' in str(category).lower():
            base_xp += 2
        
        return base_xp
    return 0

def calculate_level_from_xp(xp):
    """Calculate user level based on total XP"""
    return int(xp / 100) + 1

# Plaid API Routes
@app.route('/api/info', methods=['GET'])
def info():
    """Get API information"""
    return jsonify({
        'products': PLAID_PRODUCTS,
        'environment': PLAID_ENV,
        'country_codes': PLAID_COUNTRY_CODES
    })

@app.route('/api/create_link_token', methods=['POST'])
def create_link_token():
    """Create a Link token for Plaid Link"""
    try:
        user_id = request.json.get('user_id', str(time.time()))
        
        request_data = LinkTokenCreateRequest(
            products=products,
            client_name="RoomieLoot",
            country_codes=list(map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=user_id
            )
        )
        
        response = client.link_token_create(request_data)
        return jsonify(response.to_dict())
    except ApiException as e:
        return jsonify(format_error(e)), 400

@app.route('/api/set_access_token', methods=['POST'])
def set_access_token():
    """Exchange public token for access token"""
    try:
        public_token = request.json.get('public_token')
        user_id = request.json.get('user_id', 'default_user')
        
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token
        )
        exchange_response = client.item_public_token_exchange(exchange_request)
        
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']
        
        # Store access token for user
        if user_id not in access_tokens:
            access_tokens[user_id] = {}
        access_tokens[user_id][item_id] = access_token
        
        # Initialize user data if not exists
        if user_id not in user_data:
            user_data[user_id] = {
                'xp': 0,
                'level': 1,
                'achievements': [],
                'total_spent': 0,
                'total_earned': 0
            }
        
        return jsonify({
            'access_token': access_token,
            'item_id': item_id,
            'user_id': user_id
        })
    except ApiException as e:
        return jsonify(format_error(e)), 400

@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    """Get user accounts"""
    try:
        user_id = request.args.get('user_id', 'default_user')
        item_id = request.args.get('item_id')
        
        if not item_id or user_id not in access_tokens or item_id not in access_tokens[user_id]:
            return jsonify({'error': 'Invalid user or item ID'}), 400
        
        access_token = access_tokens[user_id][item_id]
        
        request_data = AccountsGetRequest(access_token=access_token)
        response = client.accounts_get(request_data)
        
        return jsonify(response.to_dict())
    except ApiException as e:
        return jsonify(format_error(e)), 400

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get user transactions"""
    try:
        user_id = request.args.get('user_id', 'default_user')
        item_id = request.args.get('item_id')
        days = int(request.args.get('days', 30))
        
        if not item_id or user_id not in access_tokens or item_id not in access_tokens[user_id]:
            return jsonify({'error': 'Invalid user or item ID'}), 400
        
        access_token = access_tokens[user_id][item_id]
        
        # Calculate date range
        start_date = datetime.now() - timedelta(days=days)
        end_date = datetime.now()
        
        options = TransactionsGetRequestOptions()
        request_data = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date.date(),
            end_date=end_date.date(),
            options=options
        )
        
        response = client.transactions_get(request_data)
        
        # Calculate XP for transactions
        transactions = response.to_dict().get('transactions', [])
        total_xp = 0
        for transaction in transactions:
            xp = calculate_xp_from_transaction(transaction)
            transaction['xp_earned'] = xp
            total_xp += xp
        
        # Update user XP
        if user_id in user_data:
            user_data[user_id]['xp'] += total_xp
            user_data[user_id]['level'] = calculate_level_from_xp(user_data[user_id]['xp'])
        
        return jsonify({
            'transactions': transactions,
            'total_xp_earned': total_xp,
            'user_xp': user_data.get(user_id, {}).get('xp', 0),
            'user_level': user_data.get(user_id, {}).get('level', 1)
        })
    except ApiException as e:
        return jsonify(format_error(e)), 400

@app.route('/api/balance', methods=['GET'])
def get_balance():
    """Get account balances"""
    try:
        user_id = request.args.get('user_id', 'default_user')
        item_id = request.args.get('item_id')
        
        if not item_id or user_id not in access_tokens or item_id not in access_tokens[user_id]:
            return jsonify({'error': 'Invalid user or item ID'}), 400
        
        access_token = access_tokens[user_id][item_id]
        
        request_data = AccountsBalanceGetRequest(access_token=access_token)
        response = client.accounts_balance_get(request_data)
        
        return jsonify(response.to_dict())
    except ApiException as e:
        return jsonify(format_error(e)), 400

# Gamification Routes
@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    """Get user profile with gamification data"""
    user_id = request.args.get('user_id', 'default_user')
    
    if user_id not in user_data:
        user_data[user_id] = {
            'xp': 0,
            'level': 1,
            'achievements': [],
            'total_spent': 0,
            'total_earned': 0
        }
    
    return jsonify({
        'user_id': user_id,
        'xp': user_data[user_id]['xp'],
        'level': user_data[user_id]['level'],
        'achievements': user_data[user_id]['achievements'],
        'total_spent': user_data[user_id]['total_spent'],
        'total_earned': user_data[user_id]['total_earned']
    })

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get leaderboard of users by XP"""
    limit = int(request.args.get('limit', 10))
    
    # Sort users by XP
    sorted_users = sorted(
        user_data.items(),
        key=lambda x: x[1]['xp'],
        reverse=True
    )
    
    leaderboard = []
    for rank, (user_id, data) in enumerate(sorted_users[:limit], 1):
        leaderboard.append({
            'rank': rank,
            'user_id': user_id,
            'xp': data['xp'],
            'level': data['level']
        })
    
    return jsonify({'leaderboard': leaderboard})

@app.route('/api/achievements', methods=['GET'])
def get_achievements():
    """Get available achievements"""
    achievements = [
        {
            'id': 'first_transaction',
            'name': 'First Steps',
            'description': 'Make your first transaction',
            'xp_reward': 10,
            'icon': '🎯'
        },
        {
            'id': 'spender_level_1',
            'name': 'Small Spender',
            'description': 'Spend $100 total',
            'xp_reward': 25,
            'icon': '💸'
        },
        {
            'id': 'level_5',
            'name': 'Rising Star',
            'description': 'Reach level 5',
            'xp_reward': 50,
            'icon': '⭐'
        },
        {
            'id': 'food_lover',
            'name': 'Food Lover',
            'description': 'Make 10 food transactions',
            'xp_reward': 30,
            'icon': '🍕'
        }
    ]
    
    return jsonify({'achievements': achievements})

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'plaid_env': PLAID_ENV
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
