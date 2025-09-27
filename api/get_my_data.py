#!/usr/bin/env python3
"""
Simple script to get financial data using your Plaid credentials
"""

from plaid_client import PlaidClient
import json

def categorize_transaction(transaction):
    """Categorize transaction based on merchant name and other data"""
    merchant = (transaction.get('merchant_name') or transaction.get('name', '')).lower()
    amount = transaction.get('amount', 0)
    
    # Food & Dining
    food_keywords = ['starbucks', 'mcdonald', 'kfc', 'restaurant', 'food', 'dining', 'coffee', 'pizza', 'burger']
    if any(keyword in merchant for keyword in food_keywords):
        return "🍔 Food & Dining"
    
    # Transportation
    transport_keywords = ['uber', 'lyft', 'taxi', 'airline', 'united', 'delta', 'gas', 'fuel', 'parking']
    if any(keyword in merchant for keyword in transport_keywords):
        return "🚗 Transportation"
    
    # Shopping & Retail
    shopping_keywords = ['amazon', 'walmart', 'target', 'shop', 'store', 'retail', 'merchandise']
    if any(keyword in merchant for keyword in shopping_keywords):
        return "🛍️ Shopping & Retail"
    
    # Entertainment
    entertainment_keywords = ['netflix', 'spotify', 'movie', 'theater', 'game', 'entertainment', 'fun']
    if any(keyword in merchant for keyword in entertainment_keywords):
        return "🎬 Entertainment"
    
    # Bills & Utilities
    bills_keywords = ['electric', 'water', 'gas', 'internet', 'phone', 'cable', 'utility', 'payment']
    if any(keyword in merchant for keyword in bills_keywords):
        return "💡 Bills & Utilities"
    
    # Healthcare
    healthcare_keywords = ['hospital', 'clinic', 'pharmacy', 'medical', 'doctor', 'health']
    if any(keyword in merchant for keyword in healthcare_keywords):
        return "🏥 Healthcare"
    
    # Income & Deposits
    if amount < 0 or 'deposit' in merchant or 'payroll' in merchant or 'salary' in merchant:
        return "💰 Income & Deposits"
    
    # Credit Card Payments
    if 'credit card' in merchant or 'payment' in merchant:
        return "💳 Credit Card Payments"
    
    # Investments
    investment_keywords = ['investment', 'stock', 'bond', 'fund', 'brokerage']
    if any(keyword in merchant for keyword in investment_keywords):
        return "📈 Investments"
    
    # Default category
    return "📋 Other"

def main():
    """Get financial data using your credentials"""
    
    # Initialize client (reads from .env file)
    client = PlaidClient()
    
    print("🚀 Getting Financial Data from Your Account")
    print("=" * 50)
    
    # Option 1: Get test data (works immediately)
    print("\n📊 Getting Sandbox Test Data...")
    test_data = client.get_sandbox_data_with_transactions()
    
    if 'error' not in test_data:
        print("✅ Test data retrieved successfully!")
        print(f"   📈 Accounts: {len(test_data['accounts'])}")
        print(f"   💳 Transactions: {len(test_data['transactions'])}")
        print(f"   📊 Holdings: {len(test_data['holdings'])}")
        
        # Save to file
        client.save_data_to_file(test_data, 'my_financial_data.json')
        print("💾 Data saved to 'my_financial_data.json'")
        
        # Show sample data
        print("\n📋 Sample Account Data:")
        if test_data['accounts']:
            account = test_data['accounts'][0]
            print(f"   Account: {account['name']}")
            print(f"   Balance: ${account['balances']['current']}")
            print(f"   Type: {account['type']}")
        
        print("\n📋 All Transactions:")
        if test_data['transactions']:
            for i, transaction in enumerate(test_data['transactions'], 1):
                merchant = transaction.get('merchant_name') or transaction.get('name', 'Unknown')
                amount = transaction.get('amount', 0)
                category = categorize_transaction(transaction)
                
                # Format the display with category
                print(f"   {i:2d}. {merchant}, ${amount:,.2f}, {category}")
        else:
            print("   No transactions found")
    
    else:
        print(f"❌ Error: {test_data['error']}")
    
    # Option 2: Show how to get real data
    print("\n" + "="*50)
    print("🔐 TO GET REAL DATA FROM YOUR BANK:")
    print("="*50)
    print("1. Use the Link token with Plaid Link on your frontend")
    print("2. Connect your bank account")
    print("3. Exchange public_token for access_token")
    print("4. Call client.get_complete_financial_data()")
    
    # Create link token for real data
    print("\n🔗 Creating Link Token...")
    link_response = client.create_link_token()
    
    if 'error' not in link_response:
        print(f"✅ Link token: {link_response['link_token']}")
        print("\n💡 Use this token with Plaid Link to connect your bank!")
    else:
        print(f"❌ Error creating link token: {link_response['error']}")

if __name__ == "__main__":
    main()
