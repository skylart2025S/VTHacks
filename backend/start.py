#!/usr/bin/env python3
"""
RoomieLoot Backend Startup Script
Initializes the database and starts the FastAPI server
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

def setup_database():
    """Initialize database tables"""
    try:
        from database.database import create_tables
        create_tables()
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Failed to create database tables: {e}")
        return False
    return True

def check_environment():
    """Check if required environment variables are set"""
    required_vars = [
        'PLAID_CLIENT_ID',
        'PLAID_SECRET',
        'FIREBASE_SERVICE_ACCOUNT_PATH'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease copy env_example.txt to .env and fill in your values")
        return False
    
    print("✅ Environment variables configured")
    return True

def main():
    """Main startup function"""
    print("🚀 Starting RoomieLoot Backend...")
    print("=" * 50)
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        sys.exit(1)
    
    # Start the server
    print("\n🌐 Starting FastAPI server...")
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
