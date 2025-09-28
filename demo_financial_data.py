#!/usr/bin/env python3
"""
Quick demonstration script showing unique financial data generation
Run this after starting your Next.js server to see the system in action
"""

import requests
import json
import time

def demonstrate_unique_financial_data():
    """Demonstrate that each user gets unique financial data"""
    
    print("RoomieLoot Financial Data Uniqueness Demo")
    print("=" * 50)
    
    base_url = "http://localhost:3000"
    
    # Test server connection
    try:
        response = requests.get(f"{base_url}/api/auth/test", timeout=5)
        if response.status_code == 200:
            print("[SUCCESS] Server is running")
        else:
            print("[ERROR] Server test failed")
            return
    except:
        print("[ERROR] Server is not running. Please start with: npm run dev")
        return
    
    print("\n[INFO] Creating test users...")
    
    # Create 3 test users
    users = []
    for i in range(3):
        username = f"demo_user_{i+1}_{int(time.time())}"
        password = "demo123"
        
        print(f"   Creating user: {username}")
        
        try:
            response = requests.post(
                f"{base_url}/api/auth/register",
                json={"username": username, "password": password},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                data = response.json()
                users.append({
                    "username": username,
                    "userId": data.get("userId"),
                    "financialData": data.get("financialData", {}),
                    "generated": data.get("financialDataGenerated", False)
                })
                print(f"   [SUCCESS] Created successfully")
            else:
                print(f"   [ERROR] Failed: {response.status_code}")
                
        except Exception as e:
            print(f"   [ERROR] Error: {str(e)}")
        
        time.sleep(1)  # Small delay
    
    print(f"\n[INFO] Analysis Results:")
    print(f"   Users created: {len(users)}")
    
    # Analyze uniqueness
    item_ids = []
    account_balances = []
    
    for user in users:
        if user["generated"] and user["financialData"]:
            # Extract item ID
            item_id = user["financialData"].get("metadata", {}).get("item_id")
            if item_id:
                item_ids.append(item_id)
            
            # Extract account balances
            accounts = user["financialData"].get("accounts", [])
            for account in accounts:
                balance = account.get("balances", {}).get("current", 0)
                account_balances.append(balance)
    
    print(f"   Users with financial data: {len([u for u in users if u['generated']])}")
    print(f"   Unique Plaid item IDs: {len(set(item_ids))}")
    print(f"   Total account balances: {len(account_balances)}")
    
    # Show detailed comparison
    print(f"\n[INFO] Detailed Comparison:")
    for i, user in enumerate(users):
        if user["generated"] and user["financialData"]:
            metadata = user["financialData"].get("metadata", {})
            accounts = user["financialData"].get("accounts", [])
            transactions = user["financialData"].get("transactions", [])
            
            print(f"   User {i+1}: {user['username']}")
            print(f"     User ID: {user['userId'][:12]}...")
            print(f"     Plaid Item ID: {metadata.get('item_id', 'N/A')[:12]}...")
            print(f"     Accounts: {len(accounts)}")
            print(f"     Transactions: {len(transactions)}")
            
            if accounts:
                total_balance = sum(acc.get("balances", {}).get("current", 0) for acc in accounts)
                print(f"     Total Balance: ${total_balance:,.2f}")
            print()
    
    # Check uniqueness
    unique_item_ids = len(set(item_ids))
    total_users_with_data = len([u for u in users if u["generated"]])
    
    if unique_item_ids == total_users_with_data and total_users_with_data > 0:
        print("[SUCCESS] Each user received unique financial data!")
        print("   All Plaid item IDs are unique")
        print("   Each user has different financial profile")
    else:
        print("[WARNING] Some users may have received duplicate data")
        print(f"   Expected {total_users_with_data} unique item IDs, got {unique_item_ids}")
    
    print(f"\n[INFO] To run comprehensive testing, use:")
    print(f"   python test_financial_data_uniqueness.py")

if __name__ == "__main__":
    demonstrate_unique_financial_data()
