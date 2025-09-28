#!/usr/bin/env python3
"""
Generate unique financial data for a specific user using Plaid sandbox
This script is called from the Next.js API route to generate user-specific data
"""

import sys
import json
import os
import random
from datetime import datetime, timedelta
from plaid_client import PlaidClient

def transform_to_minimal_format(raw_data):
    """Transform raw Plaid data to the minimal format expected by the API"""
    
    # Calculate total current balance from all accounts
    total_balance = 0
    for account in raw_data.get('accounts', []):
        balance = account.get('balances', {}).get('current', 0)
        # For credit cards, balance represents debt (negative)
        if account.get('type') == 'credit':
            total_balance -= balance
        else:
            total_balance += balance
    
    # Extract minimal transaction data (vendor and cash flow)
    transactions = []
    for transaction in raw_data.get('transactions', []):
        merchant = transaction.get('merchant_name') or transaction.get('name', 'Unknown')
        amount = transaction.get('amount', 0)
        
        # Determine cash flow: positive for income, negative for expenses
        cash_flow = -amount  # Flip the sign to make expenses negative
        
        transactions.append({
            "vendor": merchant,
            "cash_flow": cash_flow
        })
    
    # Extract minimal investment data
    investments = []
    securities = raw_data.get('securities', [])
    for holding in raw_data.get('holdings', []):
        security_id = holding.get('security_id')
        security = next((s for s in securities if s.get('security_id') == security_id), {})
        
        symbol = security.get('ticker_symbol', 'N/A')
        current_value = holding.get('institution_value', 0)
        quantity = holding.get('quantity', 0)
        
        # Only include investments with actual value and valid symbol
        if symbol != 'N/A' and current_value > 0:
            investments.append({
                "symbol": symbol,
                "quantity": quantity,
                "current_value": current_value
            })
    
    return {
        "current_balance": total_balance,
        "transactions": transactions,
        "investments": investments,
        "metadata": raw_data.get('metadata', {})
    }

def generate_mock_financial_data(user_id: str, output_file: str):
    """Generate mock financial data when Plaid credentials are not available"""
    
    print(f"[INFO] Generating mock financial data for user: {user_id}")
    
    # Use user_id as seed for consistent randomization
    random.seed(hash(user_id))
    
    # Generate mock accounts
    account_types = ['checking', 'savings', 'credit']
    accounts = []
    
    for i, account_type in enumerate(account_types):
        # Generate unique balance based on user_id
        base_balance = random.uniform(1000, 50000)
        account_id = f"mock_account_{i+1}_{hash(user_id) % 10000}"
        
        accounts.append({
            "account_id": account_id,
            "name": f"{account_type.title()} Account",
            "type": account_type,
            "subtype": "checking" if account_type == "checking" else "savings" if account_type == "savings" else "credit card",
            "balances": {
                "current": round(base_balance, 2),
                "available": round(base_balance * 0.9, 2) if account_type != "credit" else round(base_balance * 0.8, 2)
            }
        })
    
    # Generate mock transactions
    vendors = ["Starbucks", "Amazon", "Uber", "Netflix", "Spotify", "McDonald's", "Target", "Walmart", "Gas Station", "Restaurant"]
    transactions = []
    
    for i in range(random.randint(10, 25)):
        vendor = random.choice(vendors)
        amount = round(random.uniform(5, 200), 2)
        transaction_id = f"mock_transaction_{i+1}_{hash(user_id) % 10000}"
        
        transactions.append({
            "transaction_id": transaction_id,
            "account_id": random.choice(accounts)["account_id"],
            "amount": amount,
            "date": (datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
            "name": vendor,
            "merchant_name": vendor,
            "category": ["Food and Drink", "Transportation", "Entertainment", "Shopping"][random.randint(0, 3)]
        })
    
    # Generate mock holdings
    holdings = []
    securities = []
    
    stock_symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META", "NVDA"]
    
    for i, symbol in enumerate(random.sample(stock_symbols, random.randint(3, 5))):
        quantity = random.uniform(1, 100)
        price = random.uniform(50, 500)
        
        securities.append({
            "security_id": f"mock_security_{i+1}",
            "isin": f"US{symbol}123456",
            "cusip": f"{symbol}123456",
            "sedol": f"{symbol}1234",
            "institution_security_id": f"INST_{symbol}",
            "institution_id": "mock_institution",
            "proxy_security_id": None,
            "name": f"{symbol} Inc.",
            "ticker_symbol": symbol,
            "is_cash_equivalent": False,
            "type": "equity",
            "close_price": price,
            "close_price_as_of": datetime.now().strftime("%Y-%m-%d"),
            "iso_currency_code": "USD",
            "unofficial_currency_code": None
        })
        
        holdings.append({
            "account_id": random.choice(accounts)["account_id"],
            "security_id": f"mock_security_{i+1}",
            "institution_price": price,
            "institution_price_as_of": datetime.now().strftime("%Y-%m-%d"),
            "institution_value": round(quantity * price, 2),
            "cost_basis": round(quantity * price * random.uniform(0.8, 1.2), 2),
            "quantity": round(quantity, 4),
            "iso_currency_code": "USD",
            "unofficial_currency_code": None
        })
    
    # Create financial data structure
    financial_data = {
        "accounts": accounts,
        "transactions": transactions,
        "holdings": holdings,
        "securities": securities,
        "investment_transactions": [],
        "metadata": {
            "user_id": user_id,
            "generated_at": datetime.now().isoformat(),
            "data_source": "mock_data",
            "item_id": f"mock_item_{hash(user_id) % 10000}",
            "total_accounts": len(accounts),
            "total_transactions": len(transactions),
            "total_holdings": len(holdings)
        }
    }
    
    # Transform to minimal format
    transformed_data = transform_to_minimal_format(financial_data)
    
    # Save to file
    with open(output_file, 'w') as f:
        json.dump(transformed_data, f, indent=2, default=str)
    
    print(f"[SUCCESS] Mock financial data generated and saved to: {output_file}")
    print(f"   Accounts: {len(accounts)}")
    print(f"   Transactions: {len(transactions)}")
    print(f"   Holdings: {len(holdings)}")
    print(f"   Item ID: {financial_data['metadata']['item_id']}")
    
    return True

def generate_user_financial_data(user_id: str, output_file: str):
    """Generate unique financial data for a specific user"""
    
    print(f"[INFO] Generating financial data for user: {user_id}")
    
    try:
        # Try to initialize Plaid client
        try:
            client = PlaidClient()
            print("[INFO] Plaid client initialized successfully")
        except ValueError as e:
            print(f"[WARNING] Plaid credentials not configured: {str(e)}")
            print("[INFO] Generating mock financial data instead...")
            return generate_mock_financial_data(user_id, output_file)
        
        # Generate unique sandbox data
        print("[INFO] Fetching unique sandbox data from Plaid...")
        financial_data = client.get_sandbox_data_with_transactions()
        
        if 'error' in financial_data:
            print(f"[ERROR] Error fetching data: {financial_data['error']}")
            print("[INFO] Falling back to mock data...")
            return generate_mock_financial_data(user_id, output_file)
        
        # Add user-specific metadata
        financial_data['metadata'] = financial_data.get('metadata', {})
        financial_data['metadata']['user_id'] = user_id
        financial_data['metadata']['generated_at'] = datetime.now().isoformat()
        financial_data['metadata']['unique_session'] = f"{user_id}_{datetime.now().timestamp()}"
        
        # Add some randomization to make data unique per user
        import random
        random.seed(hash(user_id))  # Use user_id as seed for consistent randomization
        
        # Modify transaction amounts slightly based on user_id
        for transaction in financial_data.get('transactions', []):
            if 'amount' in transaction:
                # Add small random variation based on user_id
                variation = random.uniform(0.95, 1.05)
                transaction['amount'] = round(transaction['amount'] * variation, 2)
        
        # Modify account balances slightly
        for account in financial_data.get('accounts', []):
            if 'balances' in account and 'current' in account['balances']:
                variation = random.uniform(0.98, 1.02)
                account['balances']['current'] = round(account['balances']['current'] * variation, 2)
        
        # Modify investment values
        for holding in financial_data.get('holdings', []):
            if 'quantity' in holding and 'institution_price' in holding:
                variation = random.uniform(0.99, 1.01)
                holding['institution_price'] = round(holding['institution_price'] * variation, 2)
        
        # Transform data to the expected format
        transformed_data = transform_to_minimal_format(financial_data)
        
        # Save to file
        with open(output_file, 'w') as f:
            json.dump(transformed_data, f, indent=2, default=str)
        
        print(f"[SUCCESS] Financial data generated and saved to: {output_file}")
        print(f"   Accounts: {len(financial_data.get('accounts', []))}")
        print(f"   Transactions: {len(financial_data.get('transactions', []))}")
        print(f"   Holdings: {len(financial_data.get('holdings', []))}")
        print(f"   Item ID: {financial_data.get('metadata', {}).get('item_id', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Error generating financial data: {str(e)}")
        return False

def main():
    """Main function called from Next.js API"""
    if len(sys.argv) != 3:
        print("Usage: python generate_user_financial_data.py <user_id> <output_file>")
        sys.exit(1)
    
    user_id = sys.argv[1]
    output_file = sys.argv[2]
    
    success = generate_user_financial_data(user_id, output_file)
    
    if success:
        print("[SUCCESS] Financial data generation completed successfully")
        sys.exit(0)
    else:
        print("[ERROR] Financial data generation failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
