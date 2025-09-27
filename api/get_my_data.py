#!/usr/bin/env python3
"""
Minimal financial data generator using Plaid API
"""

from plaid_client import PlaidClient
import json

def create_minimal_financial_data(raw_data):
    """Create ultra-minimal financial data with only essential information"""
    
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
        "investments": investments
    }

def main():
    """Generate minimal financial data"""
    
    # Initialize client
    client = PlaidClient()
    
    print("🚀 Generating Minimal Financial Data")
    print("=" * 40)
    
    # Get sandbox test data
    print("\n📊 Fetching data from Plaid...")
    test_data = client.get_sandbox_data_with_transactions()
    
    if 'error' not in test_data:
        print("✅ Data retrieved successfully!")
        
        # Create minimal version
        minimal_data = create_minimal_financial_data(test_data)
        
        # Save to file
        with open('minimal_financial_data.json', 'w') as f:
            json.dump(minimal_data, f, indent=2, default=str)
        print("💾 Minimal data saved to 'minimal_financial_data.json'")
        
        # Show summary
        print(f"\n📊 Summary:")
        print(f"   Current Balance: ${minimal_data['current_balance']:,.2f}")
        print(f"   Total Transactions: {len(minimal_data['transactions'])}")
        print(f"   Total Investments: {len(minimal_data['investments'])}")
    
    else:
        print(f"❌ Error: {test_data['error']}")

if __name__ == "__main__":
    main()
