"""
RoomieLoot Backend API
FastAPI backend for user authentication, bank account linking, and transaction management
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv

from auth.firebase_auth import FirebaseAuth
from database.database import get_db
from api.auth_routes import router as auth_router
from api.bank_routes import router as bank_router
from api.transaction_routes import router as transaction_router
from models.user import User

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="RoomieLoot API",
    description="Backend API for RoomieLoot - Financial management for roommates",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize Firebase Auth
firebase_auth = FirebaseAuth()

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(bank_router, prefix="/api/bank", tags=["Bank Accounts"])
app.include_router(transaction_router, prefix="/api/transactions", tags=["Transactions"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "RoomieLoot API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
