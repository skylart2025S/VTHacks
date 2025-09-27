#!/usr/bin/env python3
"""
RoomieLoot Backend Test Script
Test the Plaid API integration and gamification features
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Status: {response.json()['status']}")
            print(f"   Plaid Env: {response.json()['plaid_env']}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

def test_info():
    """Test info endpoint"""
    print("\n🔍 Testing info endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/info")
        if response.status_code == 200:
            print("✅ Info endpoint working")
            data = response.json()
            print(f"   Products: {data['products']}")
            print(f"   Environment: {data['environment']}")
        else:
            print(f"❌ Info endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Info endpoint error: {e}")

def test_link_token():
    """Test link token creation"""
    print("\n🔍 Testing link token creation...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/create_link_token",
            json={"user_id": "test_user_123"}
        )
        if response.status_code == 200:
            print("✅ Link token creation successful")
            data = response.json()
            print(f"   Link token: {data['link_token'][:20]}...")
        else:
            print(f"❌ Link token creation failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Link token creation error: {e}")

def test_gamification():
    """Test gamification endpoints"""
    print("\n🔍 Testing gamification endpoints...")
    
    # Test user profile
    try:
        response = requests.get(f"{BASE_URL}/api/user/profile?user_id=test_user")
        if response.status_code == 200:
            print("✅ User profile endpoint working")
            data = response.json()
            print(f"   User XP: {data['xp']}")
            print(f"   User Level: {data['level']}")
        else:
            print(f"❌ User profile failed: {response.status_code}")
    except Exception as e:
        print(f"❌ User profile error: {e}")
    
    # Test leaderboard
    try:
        response = requests.get(f"{BASE_URL}/api/leaderboard")
        if response.status_code == 200:
            print("✅ Leaderboard endpoint working")
            data = response.json()
            print(f"   Leaderboard entries: {len(data['leaderboard'])}")
        else:
            print(f"❌ Leaderboard failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Leaderboard error: {e}")
    
    # Test achievements
    try:
        response = requests.get(f"{BASE_URL}/api/achievements")
        if response.status_code == 200:
            print("✅ Achievements endpoint working")
            data = response.json()
            print(f"   Available achievements: {len(data['achievements'])}")
        else:
            print(f"❌ Achievements failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Achievements error: {e}")

def main():
    """Run all tests"""
    print("🧪 RoomieLoot Backend Test Suite")
    print("=" * 40)
    
    test_health()
    test_info()
    test_link_token()
    test_gamification()
    
    print("\n" + "=" * 40)
    print("🏁 Test suite completed!")
    print("\n💡 Next steps:")
    print("   1. Get Plaid credentials from https://dashboard.plaid.com/")
    print("   2. Update your .env file with real credentials")
    print("   3. Test with actual Plaid Link integration")

if __name__ == "__main__":
    main()
