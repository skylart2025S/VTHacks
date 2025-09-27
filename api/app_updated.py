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

# Import database models
from models import db, User, PlaidItem, Account, Transaction, Achievement, UserAchievement, init_db

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///roomieloot.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Initialize database
init_db(app)

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

def check_and_award_achievements(user):
    """Check and award achievements for a user"""
    new_achievements = []
    
    # Get all active achievements
    achievements = Achievement.query.filter_by(is_active=True).all()
    
    for achievement in achievements:
        # Check if user already has this achievement
        if UserAchievement.query.filter_by(user_id=user.id, achievement_id=achievement.id).first():
            continue
        
        earned = False
        
        if achievement.condition_type == 'xp':
            earned = user.xp >= achievement.condition_value
        elif achievement.condition_type == 'level':
            earned = user.level >= achievement.condition_value
        elif achievement.condition_type == 'spending':
            earned = user.total_spent >= achievement.condition_value
        elif achievement.condition_type == 'transactions':
            transaction_count = Transaction.query.filter_by(user_id=user.id).count()
            earned = transaction_count >= achievement.condition_value
        elif achievement.condition_type == 'category_transactions':
            # Check for food transactions specifically
            food_transactions = Transaction.query.filter_by(user_id=user.id).filter(
                Transaction.category.like('%food%')
            ).count()
            earned = food_transactions >= achievement.condition_value
        
        if earned:
            # Award the achievement
            user_achievement = UserAchievement(
                user_id=user.id,
                achievement_id=achievement.id,
                xp_awarded=achievement.xp_reward
            )
            db.session.add(user_achievement)
            
            # Add XP to user
            user.xp += achievement.xp_reward
            user.level = calculate_level_from_xp(user.xp)
            
            new_achievements.append(achievement.to_dict())
    
    if new_achievements:
        db.session.commit()
    
    return new_achievements

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Missing username or password'}), 400
        
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        request_data = LinkTokenCreateRequest(
            products=products,
            client_name="RoomieLoot",
            country_codes=list(map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(user_id)
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
        data = request.get_json()
        public_token = data.get('public_token')
        user_id = data.get('user_id')
        
        if not public_token or not user_id:
            return jsonify({'error': 'Public token and user ID required'}), 400
        
        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token
        )
        exchange_response = client.item_public_token_exchange(exchange_request)
        
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']
        
        # Check if item already exists
        existing_item = PlaidItem.query.filter_by(item_id=item_id).first()
        if existing_item:
            return jsonify({'error': 'Item already connected'}), 400
        
        # Create new Plaid item
        plaid_item = PlaidItem(
            user_id=user_id,
            item_id=item_id,
            access_token=access_token
        )
        
        db.session.add(plaid_item)
        db.session.commit()
        
        # Fetch and store accounts
        accounts_request = AccountsGetRequest(access_token=access_token)
        accounts_response = client.accounts_get(accounts_request)
        
        for account_data in accounts_response['accounts']:
            account = Account(
                plaid_item_id=plaid_item.id,
                account_id=account_data['account_id'],
                name=account_data.get('name'),
                official_name=account_data.get('official_name'),
                type=account_data.get('type'),
                subtype=account_data.get('subtype'),
                current_balance=account_data['balances'].get('current', 0),
                available_balance=account_data['balances'].get('available', 0)
            )
            db.session.add(account)
        
        db.session.commit()
        
        return jsonify({
            'access_token': access_token,
            'item_id': item_id,
            'user_id': user_id,
            'message': 'Bank account connected successfully'
        })
    except ApiException as e:
        db.session.rollback()
        return jsonify(format_error(e)), 400

@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    """Get user accounts"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's Plaid items
        plaid_items = PlaidItem.query.filter_by(user_id=user_id).all()
        
        accounts = []
        for item in plaid_items:
            item_accounts = Account.query.filter_by(plaid_item_id=item.id).all()
            for account in item_accounts:
                accounts.append(account.to_dict())
        
        return jsonify({'accounts': accounts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get user transactions"""
    try:
        user_id = request.args.get('user_id')
        days = int(request.args.get('days', 30))
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's Plaid items
        plaid_items = PlaidItem.query.filter_by(user_id=user_id).all()
        
        all_transactions = []
        total_xp_earned = 0
        
        for item in plaid_items:
            try:
                # Calculate date range
                start_date = datetime.now() - timedelta(days=days)
                end_date = datetime.now()
                
                options = TransactionsGetRequestOptions()
                request_data = TransactionsGetRequest(
                    access_token=item.access_token,
                    start_date=start_date.date(),
                    end_date=end_date.date(),
                    options=options
                )
                
                response = client.transactions_get(request_data)
                transactions = response.to_dict().get('transactions', [])
                
                for transaction_data in transactions:
                    # Check if transaction already exists
                    existing_transaction = Transaction.query.filter_by(
                        transaction_id=transaction_data['transaction_id']
                    ).first()
                    
                    if not existing_transaction:
                        # Calculate XP
                        xp = calculate_xp_from_transaction(transaction_data)
                        
                        # Create transaction record
                        transaction = Transaction(
                            user_id=user_id,
                            account_id=Account.query.filter_by(
                                account_id=transaction_data['account_id']
                            ).first().id,
                            transaction_id=transaction_data['transaction_id'],
                            amount=transaction_data['amount'],
                            date=datetime.fromisoformat(transaction_data['date'].replace('Z', '+00:00')),
                            name=transaction_data.get('name'),
                            merchant_name=transaction_data.get('merchant_name'),
                            category=json.dumps(transaction_data.get('category', [])),
                            subcategory=json.dumps(transaction_data.get('subcategory', [])),
                            xp_earned=xp
                        )
                        
                        db.session.add(transaction)
                        
                        # Update user totals
                        if transaction_data['amount'] < 0:
                            user.total_spent += abs(transaction_data['amount'])
                        else:
                            user.total_earned += transaction_data['amount']
                        
                        total_xp_earned += xp
                    
                    # Add to response
                    transaction_dict = transaction_data.copy()
                    transaction_dict['xp_earned'] = existing_transaction.xp_earned if existing_transaction else xp
                    all_transactions.append(transaction_dict)
                
                # Update last sync
                item.last_sync = datetime.utcnow()
                
            except ApiException as e:
                print(f"Error fetching transactions for item {item.item_id}: {e}")
                continue
        
        # Update user XP and level
        user.xp += total_xp_earned
        user.level = calculate_level_from_xp(user.xp)
        
        # Check for new achievements
        new_achievements = check_and_award_achievements(user)
        
        db.session.commit()
        
        return jsonify({
            'transactions': all_transactions,
            'total_xp_earned': total_xp_earned,
            'user_xp': user.xp,
            'user_level': user.level,
            'new_achievements': new_achievements
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/balance', methods=['GET'])
def get_balance():
    """Get account balances"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's accounts
        plaid_items = PlaidItem.query.filter_by(user_id=user_id).all()
        
        total_balance = 0
        accounts = []
        
        for item in plaid_items:
            item_accounts = Account.query.filter_by(plaid_item_id=item.id).all()
            for account in item_accounts:
                total_balance += account.current_balance
                accounts.append(account.to_dict())
        
        return jsonify({
            'total_balance': total_balance,
            'accounts': accounts
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Gamification Routes
@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    """Get user profile with gamification data"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user achievements
        user_achievements = UserAchievement.query.filter_by(user_id=user_id).all()
        achievements = [ua.to_dict() for ua in user_achievements]
        
        profile = user.to_dict()
        profile['achievements'] = achievements
        
        return jsonify(profile)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get leaderboard of users by XP"""
    try:
        limit = int(request.args.get('limit', 10))
        
        # Get top users by XP
        top_users = User.query.order_by(User.xp.desc()).limit(limit).all()
        
        leaderboard = []
        for rank, user in enumerate(top_users, 1):
            leaderboard.append({
                'rank': rank,
                'user_id': user.id,
                'username': user.username,
                'xp': user.xp,
                'level': user.level
            })
        
        return jsonify({'leaderboard': leaderboard})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/achievements', methods=['GET'])
def get_achievements():
    """Get available achievements"""
    try:
        achievements = Achievement.query.filter_by(is_active=True).all()
        return jsonify({'achievements': [a.to_dict() for a in achievements]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'plaid_env': PLAID_ENV,
        'database': 'connected'
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
