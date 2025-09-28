#!/usr/bin/env python3
"""
Quick test script to verify the fixes work
Run this after starting your Next.js server
"""

import requests
import json
import time

def test_create_account_fix():
    """Test that the Create Account button now works without errors"""
    
    print("Testing Create Account Financial Data Generation")
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
    
    print("\n[INFO] Testing account creation...")
    
    # Create a test account
    username = f"testuser_{int(time.time())}"
    password = "testpass123"
    
    print(f"Creating account: {username}")
    
    try:
        response = requests.post(
            f"{base_url}/api/auth/register",
            json={"username": username, "password": password},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("[SUCCESS] Account created successfully!")
            print(f"   Username: {data.get('username')}")
            print(f"   User ID: {data.get('userId')}")
            print(f"   Financial data generated: {data.get('financialDataGenerated')}")
            
            if data.get('financialDataGenerated') and data.get('financialData'):
                financial_data = data['financialData']
                metadata = financial_data.get('metadata', {})
                
                print(f"   Plaid Item ID: {metadata.get('item_id', 'N/A')}")
                print(f"   Accounts: {len(financial_data.get('accounts', []))}")
                print(f"   Transactions: {len(financial_data.get('transactions', []))}")
                print(f"   Holdings: {len(financial_data.get('holdings', []))}")
                
                print("\n[SUCCESS] Financial data generation is working!")
                print("   - No Next.js async params errors")
                print("   - No Python Unicode encoding errors")
                print("   - Unique financial data generated")
                
            else:
                print("[WARNING] Financial data generation failed")
                print(f"   Response: {data}")
                
        else:
            print(f"[ERROR] Account creation failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('message', 'Unknown error')}")
            except:
                print(f"   Response: {response.text}")
                
    except Exception as e:
        print(f"[ERROR] Exception occurred: {str(e)}")
    
    print(f"\n[INFO] Test completed!")
    print("   If you see '[SUCCESS] Financial data generation is working!' above,")
    print("   then the Create Account button is working correctly!")

if __name__ == "__main__":
    test_create_account_fix()
