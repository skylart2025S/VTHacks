"""
Transaction categorization service for RoomieLoot
Automatically categorizes transactions based on merchant names and patterns
"""

from typing import Dict, List, Optional, Any
import re

class TransactionCategorizer:
    """Service for automatically categorizing transactions"""
    
    def __init__(self):
        """Initialize categorizer with category rules"""
        self.category_rules = {
            "🍔 Food & Dining": {
                "keywords": [
                    "starbucks", "mcdonald", "kfc", "restaurant", "food", "dining", 
                    "coffee", "pizza", "burger", "subway", "taco", "chipotle", 
                    "domino", "papa john", "kfc", "wendy", "burger king", "dunkin",
                    "tim horton", "panera", "olive garden", "outback", "applebees",
                    "chili", "buffalo wild", "red lobster", "ihop", "denny",
                    "cafe", "bakery", "deli", "grill", "bar", "pub", "tavern",
                    "fast food", "takeout", "delivery", "catering", "food truck"
                ],
                "patterns": [
                    r".*restaurant.*", r".*cafe.*", r".*diner.*", r".*grill.*",
                    r".*pizza.*", r".*burger.*", r".*sandwich.*", r".*coffee.*"
                ]
            },
            "🚗 Transportation": {
                "keywords": [
                    "uber", "lyft", "taxi", "airline", "united", "delta", 
                    "gas", "fuel", "parking", "metro", "bus", "train", "subway",
                    "amtrak", "greyhound", "rental car", "hertz", "avis", "enterprise",
                    "shell", "exxon", "chevron", "bp", "mobil", "speedway",
                    "toll", "ezpass", "fastrak", "parking meter", "garage"
                ],
                "patterns": [
                    r".*gas.*", r".*fuel.*", r".*parking.*", r".*toll.*",
                    r".*uber.*", r".*lyft.*", r".*taxi.*"
                ]
            },
            "🛍️ Shopping & Retail": {
                "keywords": [
                    "amazon", "walmart", "target", "shop", "store", "retail", 
                    "merchandise", "costco", "sams club", "home depot", "lowes",
                    "best buy", "apple store", "nike", "adidas", "macy", "nordstrom",
                    "tj maxx", "marshalls", "ross", "kohl", "jcp", "sears",
                    "ebay", "etsy", "shopify", "square", "pos"
                ],
                "patterns": [
                    r".*store.*", r".*shop.*", r".*retail.*", r".*amazon.*",
                    r".*walmart.*", r".*target.*"
                ]
            },
            "🎬 Entertainment": {
                "keywords": [
                    "netflix", "spotify", "movie", "theater", "game", "entertainment", 
                    "fun", "hulu", "disney", "hbo", "prime video", "youtube",
                    "steam", "playstation", "xbox", "nintendo", "twitch",
                    "cinema", "imax", "regal", "amc", "arcade", "bowling",
                    "golf", "tennis", "gym", "fitness", "yoga", "pilates"
                ],
                "patterns": [
                    r".*movie.*", r".*theater.*", r".*cinema.*", r".*game.*",
                    r".*entertainment.*", r".*netflix.*", r".*spotify.*"
                ]
            },
            "💡 Bills & Utilities": {
                "keywords": [
                    "electric", "water", "gas", "internet", "phone", "cable", 
                    "utility", "payment", "verizon", "att", "tmobile", "sprint",
                    "comcast", "spectrum", "cox", "directv", "dish", "hulu",
                    "electric company", "water company", "gas company",
                    "trash", "sewer", "heating", "cooling", "hvac"
                ],
                "patterns": [
                    r".*electric.*", r".*water.*", r".*gas.*", r".*utility.*",
                    r".*internet.*", r".*phone.*", r".*cable.*"
                ]
            },
            "🏥 Healthcare": {
                "keywords": [
                    "hospital", "clinic", "pharmacy", "medical", "doctor", "health",
                    "cvs", "walgreens", "rite aid", "pharmacy", "drugstore",
                    "dentist", "dental", "orthodontist", "optometrist", "eye",
                    "urgent care", "emergency", "ambulance", "medical center",
                    "healthcare", "wellness", "therapy", "counseling"
                ],
                "patterns": [
                    r".*hospital.*", r".*clinic.*", r".*pharmacy.*", r".*medical.*",
                    r".*doctor.*", r".*health.*", r".*dental.*"
                ]
            },
            "💰 Income & Deposits": {
                "keywords": [
                    "deposit", "payroll", "salary", "wage", "income", "paycheck",
                    "direct deposit", "refund", "rebate", "cashback", "reward",
                    "dividend", "interest", "bonus", "commission", "tip"
                ],
                "patterns": [
                    r".*deposit.*", r".*payroll.*", r".*salary.*", r".*income.*",
                    r".*refund.*", r".*dividend.*"
                ]
            },
            "💳 Credit Card Payments": {
                "keywords": [
                    "credit card", "payment", "minimum payment", "card payment",
                    "visa", "mastercard", "amex", "american express", "discover",
                    "chase", "bank of america", "wells fargo", "citibank",
                    "capital one", "credit union"
                ],
                "patterns": [
                    r".*credit card.*", r".*payment.*", r".*visa.*", r".*mastercard.*"
                ]
            },
            "📈 Investments": {
                "keywords": [
                    "investment", "stock", "bond", "fund", "brokerage", "robinhood",
                    "etrade", "fidelity", "schwab", "vanguard", "td ameritrade",
                    "mutual fund", "etf", "401k", "ira", "retirement", "pension"
                ],
                "patterns": [
                    r".*investment.*", r".*stock.*", r".*bond.*", r".*fund.*",
                    r".*brokerage.*", r".*401k.*", r".*ira.*"
                ]
            },
            "🏠 Housing": {
                "keywords": [
                    "rent", "mortgage", "lease", "apartment", "house", "home",
                    "landlord", "property", "real estate", "hoa", "homeowners",
                    "maintenance", "repair", "renovation", "furniture", "home depot",
                    "lowes", "ikea", "wayfair", "bed bath", "crate barrel"
                ],
                "patterns": [
                    r".*rent.*", r".*mortgage.*", r".*lease.*", r".*apartment.*",
                    r".*house.*", r".*home.*", r".*property.*"
                ]
            },
            "🎓 Education": {
                "keywords": [
                    "school", "university", "college", "tuition", "education",
                    "student", "textbook", "course", "class", "semester",
                    "library", "bookstore", "campus", "dorm", "meal plan"
                ],
                "patterns": [
                    r".*school.*", r".*university.*", r".*college.*", r".*tuition.*",
                    r".*education.*", r".*student.*"
                ]
            }
        }
    
    def categorize_transaction(self, transaction: Dict[str, Any]) -> Dict[str, str]:
        """
        Categorize a single transaction
        
        Args:
            transaction: Transaction data from Plaid
            
        Returns:
            Dict with category and subcategory
        """
        merchant_name = (transaction.get('merchant_name') or transaction.get('name', '')).lower()
        amount = transaction.get('amount', 0)
        
        # Check for income/deposits first (negative amounts or specific keywords)
        if amount < 0 or any(keyword in merchant_name for keyword in ["deposit", "payroll", "salary", "refund"]):
            return {
                "category": "💰 Income & Deposits",
                "subcategory": self._get_subcategory("💰 Income & Deposits", merchant_name)
            }
        
        # Check each category
        for category, rules in self.category_rules.items():
            if self._matches_category(merchant_name, rules):
                return {
                    "category": category,
                    "subcategory": self._get_subcategory(category, merchant_name)
                }
        
        # Default category
        return {
            "category": "📋 Other",
            "subcategory": "Uncategorized"
        }
    
    def _matches_category(self, merchant_name: str, rules: Dict[str, List[str]]) -> bool:
        """Check if merchant name matches category rules"""
        # Check keywords
        for keyword in rules["keywords"]:
            if keyword in merchant_name:
                return True
        
        # Check patterns
        for pattern in rules["patterns"]:
            if re.search(pattern, merchant_name, re.IGNORECASE):
                return True
        
        return False
    
    def _get_subcategory(self, category: str, merchant_name: str) -> str:
        """Get subcategory for a transaction"""
        subcategories = {
            "🍔 Food & Dining": {
                "fast_food": ["mcdonald", "kfc", "burger king", "wendy", "subway", "taco bell"],
                "coffee": ["starbucks", "dunkin", "tim horton", "coffee"],
                "restaurant": ["restaurant", "diner", "grill", "cafe"],
                "delivery": ["delivery", "takeout", "doordash", "ubereats", "grubhub"]
            },
            "🚗 Transportation": {
                "ride_share": ["uber", "lyft", "taxi"],
                "gas": ["gas", "fuel", "shell", "exxon", "chevron"],
                "parking": ["parking", "garage", "meter"],
                "airline": ["airline", "united", "delta", "american", "southwest"]
            },
            "🛍️ Shopping & Retail": {
                "online": ["amazon", "ebay", "etsy", "shopify"],
                "department": ["walmart", "target", "costco", "sams club"],
                "electronics": ["best buy", "apple store", "microcenter"],
                "clothing": ["nike", "adidas", "macy", "nordstrom"]
            },
            "💡 Bills & Utilities": {
                "utilities": ["electric", "water", "gas", "utility"],
                "internet": ["internet", "comcast", "spectrum", "cox"],
                "phone": ["phone", "verizon", "att", "tmobile"],
                "cable": ["cable", "directv", "dish", "hulu"]
            }
        }
        
        if category in subcategories:
            for subcategory, keywords in subcategories[category].items():
                if any(keyword in merchant_name for keyword in keywords):
                    return subcategory.replace("_", " ").title()
        
        return "General"
    
    def categorize_transactions(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Categorize multiple transactions
        
        Args:
            transactions: List of transaction data from Plaid
            
        Returns:
            List of transactions with added category information
        """
        categorized_transactions = []
        
        for transaction in transactions:
            category_info = self.categorize_transaction(transaction)
            transaction.update(category_info)
            categorized_transactions.append(transaction)
        
        return categorized_transactions
    
    def get_category_summary(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Get summary of transaction categories
        
        Args:
            transactions: List of categorized transactions
            
        Returns:
            Dict with category summary
        """
        category_totals = {}
        category_counts = {}
        
        for transaction in transactions:
            category = transaction.get('category', '📋 Other')
            amount = abs(transaction.get('amount', 0))
            
            if category not in category_totals:
                category_totals[category] = 0
                category_counts[category] = 0
            
            category_totals[category] += amount
            category_counts[category] += 1
        
        # Sort by total amount
        sorted_categories = sorted(
            category_totals.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        return {
            "category_totals": dict(sorted_categories),
            "category_counts": category_counts,
            "total_transactions": len(transactions),
            "total_amount": sum(category_totals.values())
        }

# Global instance
transaction_categorizer = TransactionCategorizer()
