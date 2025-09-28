#!/usr/bin/env python3
"""
Test script to verify mock data uniqueness
"""

import sys
import json
import os
sys.path.append('api')
from generate_user_financial_data import generate_mock_financial_data

def test_mock_data_uniqueness():
    """Test that mock data is unique for different users"""
    
    print("=== MOCK DATA UNIQUENESS TEST ===")
    print("=" * 40)
    
    # Generate data for 3 different users
    print("Generating data for 3 different users...")
    generate_mock_financial_data('user_123', 'test_user1.json')
    generate_mock_financial_data('user_456', 'test_user2.json')
    generate_mock_financial_data('user_789', 'test_user3.json')
    
    # Load the data
    with open('test_user1.json', 'r') as f:
        user1_data = json.load(f)
    with open('test_user2.json', 'r') as f:
        user2_data = json.load(f)
    with open('test_user3.json', 'r') as f:
        user3_data = json.load(f)
    
    users_data = [user1_data, user2_data, user3_data]
    user_names = ['user_123', 'user_456', 'user_789']
    
    print("\n=== ITEM IDs (should be different) ===")
    item_ids = []
    for i, user_data in enumerate(users_data):
        item_id = user_data['metadata']['item_id']
        item_ids.append(item_id)
        print(f"User {i+1} ({user_names[i]}): {item_id}")
    
    unique_item_ids = len(set(item_ids))
    print(f"\nUnique Item IDs: {unique_item_ids}/3")
    
    print("\n=== ACCOUNT BALANCES (should be different) ===")
    balances = []
    for i, user_data in enumerate(users_data):
        total_balance = sum(acc['balances']['current'] for acc in user_data['accounts'])
        balances.append(total_balance)
        print(f"User {i+1} total balance: ${total_balance:,.2f}")
    
    unique_balances = len(set([round(b, 2) for b in balances]))
    print(f"\nUnique balances: {unique_balances}/3")
    
    print("\n=== TRANSACTION COUNTS (may vary) ===")
    transaction_counts = []
    for i, user_data in enumerate(users_data):
        count = len(user_data['transactions'])
        transaction_counts.append(count)
        print(f"User {i+1} transactions: {count}")
    
    print("\n=== FIRST TRANSACTION AMOUNTS (should be different) ===")
    first_amounts = []
    for i, user_data in enumerate(users_data):
        first_transaction = user_data['transactions'][0]
        amount = first_transaction['amount']
        name = first_transaction['name']
        first_amounts.append(amount)
        print(f"User {i+1} first transaction: ${amount} - {name}")
    
    unique_amounts = len(set([round(a, 2) for a in first_amounts]))
    print(f"\nUnique first transaction amounts: {unique_amounts}/3")
    
    print("\n=== INVESTMENT HOLDINGS (should be different) ===")
    holdings_counts = []
    for i, user_data in enumerate(users_data):
        count = len(user_data['holdings'])
        holdings_counts.append(count)
        print(f"User {i+1} holdings: {count}")
    
    # Test consistency - same user should get same data
    print("\n=== CONSISTENCY TEST (same user, multiple calls) ===")
    generate_mock_financial_data('user_123', 'test_user1_again.json')
    
    with open('test_user1.json', 'r') as f:
        user1_original = json.load(f)
    with open('test_user1_again.json', 'r') as f:
        user1_again = json.load(f)
    
    original_balance = sum(acc['balances']['current'] for acc in user1_original['accounts'])
    again_balance = sum(acc['balances']['current'] for acc in user1_again['accounts'])
    
    print(f"User 123 original balance: ${original_balance:,.2f}")
    print(f"User 123 again balance: ${again_balance:,.2f}")
    print(f"Consistent data: {'YES' if abs(original_balance - again_balance) < 0.01 else 'NO'}")
    
    # Summary
    print("\n=== SUMMARY ===")
    print(f"✅ Unique Item IDs: {unique_item_ids == 3}")
    print(f"✅ Unique Balances: {unique_balances == 3}")
    print(f"✅ Unique Transaction Amounts: {unique_amounts == 3}")
    print(f"✅ Consistent for Same User: {abs(original_balance - again_balance) < 0.01}")
    
    if unique_item_ids == 3 and unique_balances == 3 and unique_amounts == 3:
        print("\n🎉 SUCCESS: Mock data is unique for each user!")
        print("   Each user gets different financial data")
        print("   Same user gets consistent data on multiple calls")
    else:
        print("\n⚠️  WARNING: Some data may not be unique")
    
    # Cleanup
    for filename in ['test_user1.json', 'test_user2.json', 'test_user3.json', 'test_user1_again.json']:
        if os.path.exists(filename):
            os.remove(filename)

if __name__ == "__main__":
    test_mock_data_uniqueness()
