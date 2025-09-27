def calculate_financial_score(financial_data):
    """Calculate overall financial wellness score (0-100)"""
    score = 50  # Start with average score
    
    # Get key financial metrics
    accounts = financial_data.get("accounts", [])
    transactions = financial_data.get("transactions", [])
    holdings = financial_data.get("holdings", [])
    
    # 1. Emergency Fund (0-20 points)
    liquid_accounts = [acc for acc in accounts if acc["type"] == "depository"]
    liquid_cash = sum(acc["balances"].get("current", 0) for acc in liquid_accounts)
    
    # Assume monthly expenses are roughly $3000
    monthly_expenses = 3000
    months_of_emergency = liquid_cash / monthly_expenses
    
    # Add points based on emergency fund (0-20)
    if months_of_emergency >= 6:
        score += 20
    elif months_of_emergency >= 3:
        score += 10
    elif months_of_emergency >= 1:
        score += 5
    
    # 2. Debt-to-Income (0-20 points)
    credit_cards = [acc for acc in accounts if acc["subtype"] == "credit card"]
    total_cc_debt = sum(acc["balances"].get("current", 0) for acc in credit_cards)
    
    loans = [acc for acc in accounts if acc["type"] == "loan"]
    total_loans = sum(acc["balances"].get("current", 0) for acc in loans)
    
    # Rough income estimation from transactions
    income = 5500  # Monthly income assumption
    
    # Calculate debt-to-income
    monthly_debt = total_cc_debt * 0.03  # Assume 3% minimum payment
    dti_ratio = monthly_debt / income
    
    # Add points based on DTI (0-20)
    if dti_ratio < 0.1:
        score += 20
    elif dti_ratio < 0.2:
        score += 15
    elif dti_ratio < 0.3:
        score += 10
    elif dti_ratio < 0.4:
        score += 5
    
    # 3. Investment Health (0-20 points)
    investment_accounts = [acc for acc in accounts if acc["type"] == "investment"]
    investment_value = sum(acc["balances"].get("current", 0) for acc in investment_accounts)
    
    # Reward having investments
    if investment_value > income * 12:  # 1 year of income
        score += 20
    elif investment_value > income * 6:  # 6 months of income
        score += 15
    elif investment_value > income * 3:  # 3 months of income
        score += 10
    elif investment_value > 0:
        score += 5
    
    # 4. Credit Card Utilization (0-10 points)
    cc_limits = sum(acc["balances"].get("limit", 0) for acc in credit_cards if "limit" in acc["balances"])
    if cc_limits > 0:
        utilization = total_cc_debt / cc_limits
        
        if utilization < 0.1:
            score += 10
        elif utilization < 0.3:
            score += 7
        elif utilization < 0.5:
            score += 3
    
    # 5. Spending Habits (0-10 points)
    # Simple check for negative cash flow
    recent_transactions = [t for t in transactions if t["account_id"] in 
                          [acc["account_id"] for acc in liquid_accounts]]
    
    if sum(t["amount"] for t in recent_transactions) < 0:
        score += 5  # Some positive cash flow
    else:
        score += 0  # Negative cash flow
    
    # 6. Account Diversity (0-10 points)
    account_types = set(acc["type"] for acc in accounts)
    score += min(len(account_types) * 2, 10)
    
    # Adjust score to 0-100 range
    score = max(0, min(100, score))
    return int(score)