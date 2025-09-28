#!/usr/bin/env python3
"""
Test script to verify API uniqueness
"""

import requests
import json
import time

def test_api_uniqueness():
    """Test that the API generates unique data for different users"""
    
    print("=== API UNIQUENESS TEST ===")
    print("Testing actual Create Account API calls...")
    print()
    
    # Test creating multiple accounts via API
    users = []
    for i in range(3):
        username = f'apitest_user_{i+1}_{int(time.time())}'
        print(f'Creating account: {username}')
        
        try:
            response = requests.post('http://localhost:3000/api/auth/register', 
                                   json={'username': username, 'password': 'testpass123'},
                                   headers={'Content-Type': 'application/json'})
            
            if response.status_code == 201:
                data = response.json()
                if data.get('financialDataGenerated'):
                    financial_data = data['financialData']
                    users.append({
                        'username': username,
                        'userId': data['userId'],
                        'itemId': financial_data['metadata']['item_id'],
                        'totalBalance': sum(acc['balances']['current'] for acc in financial_data['accounts']),
                        'transactionCount': len(financial_data['transactions']),
                        'firstTransaction': financial_data['transactions'][0]['amount'] if financial_data['transactions'] else 0
                    })
                    print(f'  [SUCCESS] Item ID: {financial_data["metadata"]["item_id"]}')
                else:
                    print(f'  [WARNING] No financial data generated')
            else:
                print(f'  [ERROR] Failed: {response.status_code}')
        except Exception as e:
            print(f'  [ERROR] Error: {str(e)}')
        
        time.sleep(1)
    
    print()
    print("=== API RESULTS COMPARISON ===")
    if len(users) >= 2:
        print("User IDs:")
        for user in users:
            print(f"  {user['username']}: {user['userId'][:15]}...")
        
        print()
        print("Item IDs:")
        for user in users:
            print(f"  {user['username']}: {user['itemId']}")
        
        print()
        print("Total Balances:")
        for user in users:
            print(f"  {user['username']}: ${user['totalBalance']:,.2f}")
        
        print()
        print("First Transaction Amounts:")
        for user in users:
            print(f"  {user['username']}: ${user['firstTransaction']:.2f}")
        
        # Check uniqueness
        unique_item_ids = len(set(user['itemId'] for user in users))
        unique_balances = len(set(round(user['totalBalance'], 2) for user in users))
        unique_transactions = len(set(round(user['firstTransaction'], 2) for user in users))
        
        print()
        print("=== UNIQUENESS CHECK ===")
        print(f"Unique Item IDs: {unique_item_ids}/{len(users)}")
        print(f"Unique Balances: {unique_balances}/{len(users)}")
        print(f"Unique First Transactions: {unique_transactions}/{len(users)}")
        
        if unique_item_ids == len(users) and unique_balances == len(users):
            print()
            print("🎉 SUCCESS: Each Create Account click generates unique data!")
            print("   ✅ Different users get different financial data")
            print("   ✅ Each user has unique Item ID and balances")
        else:
            print()
            print("⚠️  Some data may not be unique")
    else:
        print("❌ Not enough successful account creations to test")

if __name__ == "__main__":
    test_api_uniqueness()
