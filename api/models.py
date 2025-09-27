"""
Database models and utilities for RoomieLoot
SQLite database with SQLAlchemy for data persistence
"""

import os
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication and profile data"""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(128))
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    
    # Gamification data
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    total_spent = Column(Float, default=0.0)
    total_earned = Column(Float, default=0.0)
    
    # Relationships
    plaid_items = relationship("PlaidItem", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'xp': self.xp,
            'level': self.level,
            'total_spent': self.total_spent,
            'total_earned': self.total_earned,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class PlaidItem(db.Model):
    """Plaid item (bank connection) model"""
    __tablename__ = 'plaid_items'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    item_id = Column(String(255), unique=True, nullable=False)
    access_token = Column(Text, nullable=False)
    institution_id = Column(String(255))
    institution_name = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    last_sync = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="plaid_items")
    accounts = relationship("Account", back_populates="plaid_item", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'item_id': self.item_id,
            'institution_id': self.institution_id,
            'institution_name': self.institution_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_sync': self.last_sync.isoformat() if self.last_sync else None
        }

class Account(db.Model):
    """Bank account model"""
    __tablename__ = 'accounts'
    
    id = Column(Integer, primary_key=True)
    plaid_item_id = Column(Integer, ForeignKey('plaid_items.id'), nullable=False)
    account_id = Column(String(255), nullable=False)
    name = Column(String(255))
    official_name = Column(String(255))
    type = Column(String(50))
    subtype = Column(String(50))
    current_balance = Column(Float, default=0.0)
    available_balance = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    plaid_item = relationship("PlaidItem", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'account_id': self.account_id,
            'name': self.name,
            'official_name': self.official_name,
            'type': self.type,
            'subtype': self.subtype,
            'current_balance': self.current_balance,
            'available_balance': self.available_balance,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }

class Transaction(db.Model):
    """Transaction model with gamification data"""
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    account_id = Column(Integer, ForeignKey('accounts.id'), nullable=False)
    transaction_id = Column(String(255), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    name = Column(String(255))
    merchant_name = Column(String(255))
    category = Column(Text)  # JSON string of categories
    subcategory = Column(Text)  # JSON string of subcategories
    xp_earned = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    account = relationship("Account", back_populates="transactions")
    
    def to_dict(self):
        return {
            'id': self.id,
            'transaction_id': self.transaction_id,
            'amount': self.amount,
            'date': self.date.isoformat() if self.date else None,
            'name': self.name,
            'merchant_name': self.merchant_name,
            'category': self.category,
            'subcategory': self.subcategory,
            'xp_earned': self.xp_earned,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Achievement(db.Model):
    """Achievement model"""
    __tablename__ = 'achievements'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    icon = Column(String(10))
    xp_reward = Column(Integer, default=0)
    condition_type = Column(String(50))  # 'xp', 'spending', 'transactions', etc.
    condition_value = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'xp_reward': self.xp_reward,
            'condition_type': self.condition_type,
            'condition_value': self.condition_value,
            'is_active': self.is_active
        }

class UserAchievement(db.Model):
    """User achievement junction table"""
    __tablename__ = 'user_achievements'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    achievement_id = Column(Integer, ForeignKey('achievements.id'), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
    xp_awarded = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
    
    def to_dict(self):
        return {
            'id': self.id,
            'achievement': self.achievement.to_dict() if self.achievement else None,
            'earned_at': self.earned_at.isoformat() if self.earned_at else None,
            'xp_awarded': self.xp_awarded
        }

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        
        # Create default achievements if they don't exist
        if Achievement.query.count() == 0:
            default_achievements = [
                Achievement(
                    name="First Steps",
                    description="Make your first transaction",
                    icon="🎯",
                    xp_reward=10,
                    condition_type="transactions",
                    condition_value=1
                ),
                Achievement(
                    name="Small Spender",
                    description="Spend $100 total",
                    icon="💸",
                    xp_reward=25,
                    condition_type="spending",
                    condition_value=100
                ),
                Achievement(
                    name="Rising Star",
                    description="Reach level 5",
                    icon="⭐",
                    xp_reward=50,
                    condition_type="level",
                    condition_value=5
                ),
                Achievement(
                    name="Food Lover",
                    description="Make 10 food transactions",
                    icon="🍕",
                    xp_reward=30,
                    condition_type="category_transactions",
                    condition_value=10
                ),
                Achievement(
                    name="Big Spender",
                    description="Spend $1000 total",
                    icon="💰",
                    xp_reward=100,
                    condition_type="spending",
                    condition_value=1000
                ),
                Achievement(
                    name="Transaction Master",
                    description="Make 100 transactions",
                    icon="📊",
                    xp_reward=75,
                    condition_type="transactions",
                    condition_value=100
                )
            ]
            
            for achievement in default_achievements:
                db.session.add(achievement)
            
            db.session.commit()
            print("✅ Default achievements created")
