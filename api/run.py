#!/usr/bin/env python3
"""
RoomieLoot Backend Startup Script
Run this script to start the Flask backend server
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("⚠️  Warning: .env file not found!")
        print("Please copy env.example to .env and configure your Plaid credentials.")
        print("Run: cp env.example .env")
        sys.exit(1)
    
    # Check if required environment variables are set
    required_vars = ['PLAID_CLIENT_ID', 'PLAID_SECRET']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var) or os.getenv(var) == f'your_{var.lower()}_here':
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease update your .env file with actual Plaid credentials.")
        sys.exit(1)
    
    print("🚀 Starting RoomieLoot Backend...")
    print("📊 Plaid Environment:", os.getenv('PLAID_ENV', 'sandbox'))
    print("🌐 Server will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/api/health")
    
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
