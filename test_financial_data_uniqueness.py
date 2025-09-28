#!/usr/bin/env python3
"""
Verification script to test that creating new users generates unique financial data
This script creates multiple test users and verifies their financial data is unique
"""

import requests
import json
import time
from typing import Dict, List, Any
import hashlib

class UserFinancialDataTester:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.test_users = []
        self.financial_data_results = []
    
    def create_test_user(self, username: str, password: str = "testpass123") -> Dict[str, Any]:
        """Create a test user and return registration response"""
        print(f"🔄 Creating test user: {username}")
        
        registration_data = {
            "username": username,
            "password": password
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/auth/register",
                json=registration_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                result = response.json()
                print(f"✅ User {username} created successfully")
                print(f"   User ID: {result.get('userId', 'N/A')}")
                print(f"   Financial data generated: {result.get('financialDataGenerated', False)}")
                
                self.test_users.append({
                    "username": username,
                    "userId": result.get('userId'),
                    "registrationResponse": result
                })
                
                return result
            else:
                print(f"❌ Failed to create user {username}: {response.status_code}")
                print(f"   Response: {response.text}")
                return {"error": f"Registration failed: {response.status_code}"}
                
        except Exception as e:
            print(f"❌ Error creating user {username}: {str(e)}")
            return {"error": str(e)}
    
    def generate_additional_financial_data(self, userId: str) -> Dict[str, Any]:
        """Generate additional financial data for an existing user"""
        print(f"🔄 Generating additional financial data for user: {userId}")
        
        try:
            response = requests.post(
                f"{self.base_url}/api/users/{userId}/financial-data",
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Additional financial data generated for user {userId}")
                return result
            else:
                print(f"❌ Failed to generate additional data: {response.status_code}")
                return {"error": f"Generation failed: {response.status_code}"}
                
        except Exception as e:
            print(f"❌ Error generating additional data: {str(e)}")
            return {"error": str(e)}
    
    def calculate_data_hash(self, financial_data: Dict[str, Any]) -> str:
        """Calculate a hash of the financial data to detect uniqueness"""
        # Create a simplified version for hashing (exclude metadata that changes)
        simplified_data = {
            "accounts": financial_data.get("accounts", []),
            "transactions": financial_data.get("transactions", []),
            "holdings": financial_data.get("holdings", [])
        }
        
        # Convert to JSON string and hash
        data_string = json.dumps(simplified_data, sort_keys=True, default=str)
        return hashlib.md5(data_string.encode()).hexdigest()
    
    def analyze_uniqueness(self) -> Dict[str, Any]:
        """Analyze the uniqueness of generated financial data"""
        print("\n🔍 Analyzing financial data uniqueness...")
        
        hashes = []
        unique_hashes = set()
        analysis_results = {
            "total_users": len(self.test_users),
            "users_with_financial_data": 0,
            "unique_data_sets": 0,
            "duplicate_data_sets": 0,
            "hash_analysis": {},
            "detailed_comparison": []
        }
        
        for user in self.test_users:
            userId = user.get("userId")
            if not userId:
                continue
                
            # Get financial data from registration response
            registration_data = user.get("registrationResponse", {})
            financial_data = registration_data.get("financialData")
            
            if financial_data:
                analysis_results["users_with_financial_data"] += 1
                data_hash = self.calculate_data_hash(financial_data)
                hashes.append({
                    "userId": userId,
                    "username": user.get("username"),
                    "hash": data_hash,
                    "data": financial_data
                })
                
                if data_hash not in unique_hashes:
                    unique_hashes.add(data_hash)
                    analysis_results["unique_data_sets"] += 1
                else:
                    analysis_results["duplicate_data_sets"] += 1
        
        analysis_results["hash_analysis"] = {
            "total_hashes": len(hashes),
            "unique_hashes": len(unique_hashes),
            "duplicate_count": len(hashes) - len(unique_hashes)
        }
        
        # Detailed comparison
        for i, hash_data in enumerate(hashes):
            comparison = {
                "user": hash_data["username"],
                "userId": hash_data["userId"],
                "hash": hash_data["hash"],
                "is_unique": hash_data["hash"] in unique_hashes,
                "data_summary": {
                    "accounts_count": len(hash_data["data"].get("accounts", [])),
                    "transactions_count": len(hash_data["data"].get("transactions", [])),
                    "holdings_count": len(hash_data["data"].get("holdings", []))
                }
            }
            analysis_results["detailed_comparison"].append(comparison)
        
        return analysis_results
    
    def run_comprehensive_test(self, num_users: int = 5) -> Dict[str, Any]:
        """Run a comprehensive test creating multiple users"""
        print(f"🚀 Starting comprehensive test with {num_users} users")
        print("=" * 60)
        
        # Create multiple test users
        for i in range(num_users):
            username = f"testuser_{i+1}_{int(time.time())}"
            self.create_test_user(username)
            time.sleep(1)  # Small delay between user creations
        
        # Generate additional data for some users to test consistency
        print("\n🔄 Testing additional data generation...")
        for i, user in enumerate(self.test_users[:2]):  # Test first 2 users
            if user.get("userId"):
                self.generate_additional_financial_data(user["userId"])
                time.sleep(1)
        
        # Analyze results
        analysis = self.analyze_uniqueness()
        
        # Print results
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS")
        print("=" * 60)
        print(f"Total users created: {analysis['total_users']}")
        print(f"Users with financial data: {analysis['users_with_financial_data']}")
        print(f"Unique data sets: {analysis['unique_data_sets']}")
        print(f"Duplicate data sets: {analysis['duplicate_data_sets']}")
        
        print(f"\nHash Analysis:")
        print(f"  Total hashes: {analysis['hash_analysis']['total_hashes']}")
        print(f"  Unique hashes: {analysis['hash_analysis']['unique_hashes']}")
        print(f"  Duplicates: {analysis['hash_analysis']['duplicate_count']}")
        
        print(f"\nDetailed Comparison:")
        for comparison in analysis['detailed_comparison']:
            status = "✅ UNIQUE" if comparison['is_unique'] else "❌ DUPLICATE"
            print(f"  {comparison['user']} ({comparison['userId'][:8]}...): {status}")
            print(f"    Accounts: {comparison['data_summary']['accounts_count']}, "
                  f"Transactions: {comparison['data_summary']['transactions_count']}, "
                  f"Holdings: {comparison['data_summary']['holdings_count']}")
        
        # Determine if test passed
        uniqueness_rate = analysis['unique_data_sets'] / max(analysis['users_with_financial_data'], 1)
        test_passed = uniqueness_rate >= 0.8  # 80% uniqueness threshold
        
        print(f"\n🎯 Test Result: {'✅ PASSED' if test_passed else '❌ FAILED'}")
        print(f"   Uniqueness Rate: {uniqueness_rate:.2%}")
        print(f"   Threshold: 80%")
        
        return {
            "test_passed": test_passed,
            "uniqueness_rate": uniqueness_rate,
            "analysis": analysis
        }

def main():
    """Main function to run the verification test"""
    print("RoomieLoot Financial Data Uniqueness Test")
    print("=" * 50)
    
    # Check if server is running
    try:
        response = requests.get("http://localhost:3000/api/auth/test", timeout=5)
        print("✅ Server is running")
    except:
        print("❌ Server is not running. Please start your Next.js server first.")
        print("   Run: npm run dev")
        return
    
    # Run the test
    tester = UserFinancialDataTester()
    results = tester.run_comprehensive_test(num_users=5)
    
    # Save results to file
    with open('financial_data_test_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n💾 Test results saved to: financial_data_test_results.json")
    
    if results['test_passed']:
        print("\n🎉 SUCCESS: Each new user generates unique financial data!")
    else:
        print("\n⚠️  WARNING: Some users may have received duplicate financial data.")
        print("   This could indicate an issue with the Plaid sandbox data generation.")

if __name__ == "__main__":
    main()
