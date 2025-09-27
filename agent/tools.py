from langchain.tools import tool
import json

@tool
def get_financial_score(financial_data: str) -> str:
    """Calculate the overall financial wellness score (0-100) based on balance, spending, and investments."""
    # Parse the financial data
    data = json.loads(financial_data) if isinstance(financial_data, str) else financial_data
    
    # Start with base score
    score = 50
    
    # 1. Overall balance (up to +20 points)
    balance = data.get("current_balance", 0)
    if balance > 100000:
        score += 20
    elif balance > 50000:
        score += 15
    elif balance > 20000:
        score += 10
    elif balance > 5000:
        score += 5
    
    # 2. Spending patterns (up to +/-15 points)
    transactions = data.get("transactions", [])
    total_expenses = sum(tx["cash_flow"] for tx in transactions if tx["cash_flow"] > 0)
    total_income = abs(sum(tx["cash_flow"] for tx in transactions if tx["cash_flow"] < 0))
    
    # If income exceeds expenses, that's good
    if total_income > total_expenses * 1.5:
        score += 15
    elif total_income > total_expenses * 1.2:
        score += 10
    elif total_income > total_expenses:
        score += 5
    else:
        score -= 10  # Spending more than earning
    
    # 3. Investment portfolio (up to +15 points)
    investments = data.get("investments", [])
    total_investments = sum(inv.get("current_value", 0) for inv in investments)
    
    # Investment ratio to balance
    inv_ratio = total_investments / balance if balance > 0 else 0
    if inv_ratio > 0.5:
        score += 15
    elif inv_ratio > 0.25:
        score += 10
    elif inv_ratio > 0.1:
        score += 5
    
    # Ensure score is within 0-100 range
    score = max(0, min(100, score))
    
    result = f"FINANCIAL WELLNESS SCORE: {int(score)}/100\n\n"
    
    # Add score context
    if score >= 80:
        result += "Your financial health is excellent! You have a good balance, investments, and spending habits.\n"
    elif score >= 60:
        result += "Your financial health is good with some areas for improvement.\n"
    elif score >= 40:
        result += "Your financial health is fair. Several areas need attention.\n"
    else:
        result += "Your financial health needs significant improvement.\n"
    
    return result

@tool
def analyze_spending_patterns(financial_data: str) -> str:
    """Analyze spending patterns to identify areas of potential savings."""
    # Parse the financial data
    data = json.loads(financial_data) if isinstance(financial_data, str) else financial_data
    
    # Get transactions
    transactions = data.get("transactions", [])
    
    # Filter for spending (positive cash flow values)
    expenses = [tx for tx in transactions if tx.get("cash_flow", 0) > 0]
    
    # Group by vendor
    spending_by_vendor = {}
    for tx in expenses:
        vendor = tx.get("vendor", "Unknown")
        amount = tx.get("cash_flow", 0)
        if vendor not in spending_by_vendor:
            spending_by_vendor[vendor] = 0
        spending_by_vendor[vendor] += amount
    
    # Get top spending categories
    top_vendors = sorted(spending_by_vendor.items(), key=lambda x: x[1], reverse=True)[:3]
    
    # Generate insights
    result = "SPENDING ANALYSIS:\n"
    result += "Top spending areas:\n"
    
    for vendor, amount in top_vendors:
        result += f"- {vendor}: ${amount:.2f}\n"
    
    # Calculate total spending
    total_spending = sum(spending_by_vendor.values())
    result += f"\nTotal spending: ${total_spending:.2f}\n"
    
    # Add recommendations
    result += "\nRECOMMENDATIONS:\n"
    
    # Look for food spending (restaurants, fast food)
    food_vendors = ["KFC", "McDonald's", "Starbucks"]
    food_spending = sum(spending_by_vendor.get(v, 0) for v in food_vendors)
    if food_spending > 100:
        result += "- Reduce spending on dining out. Consider cooking more meals at home.\n"
    
    # Look for transportation spending
    if "Uber" in spending_by_vendor and spending_by_vendor["Uber"] > 10:
        result += "- Consider public transportation or carpooling to reduce Uber expenses.\n"
    
    # Look for recurring/subscription spending
    if "Touchstone Climbing" in spending_by_vendor:
        result += "- Review your gym membership and ensure you're getting value from it.\n"
    
    return result

@tool
def optimize_debt_repayment(financial_data: str) -> str:
    """Recommend optimal debt repayment strategies based on available data."""
    # Parse the financial data
    data = json.loads(financial_data) if isinstance(financial_data, str) else financial_data
    
    # Get transactions
    transactions = data.get("transactions", [])
    
    # Look for debt payments in transactions
    debt_payments = [tx for tx in transactions if "PAYMENT" in tx.get("vendor", "").upper()]
    
    result = "DEBT OPTIMIZATION ANALYSIS:\n\n"
    
    if debt_payments:
        result += "Identified debt payments:\n"
        for payment in debt_payments:
            result += f"- {payment['vendor']}: ${abs(payment['cash_flow']):.2f}\n"
    
        # Calculate total debt payments
        total_debt_payments = sum(abs(payment["cash_flow"]) for payment in debt_payments)
        result += f"\nTotal monthly debt payments: ${total_debt_payments:.2f}\n"
        
        # Check for credit card payments
        cc_payments = [p for p in debt_payments if "CREDIT" in p.get("vendor", "").upper()]
        if cc_payments:
            result += "\nCredit card debt recommendations:\n"
            result += "- Pay more than the minimum payment when possible\n"
            result += "- Consider a balance transfer card with 0% intro APR if you have high-interest debt\n"
    else:
        result += "No specific debt payments identified in the transaction data.\n"
    
    # General debt advice
    result += "\nGeneral debt repayment strategy:\n"
    result += "1. Focus on paying high-interest debt first (usually credit cards)\n"
    result += "2. Consider debt consolidation if you have multiple high-interest debts\n"
    result += "3. Build an emergency fund to avoid taking on new debt for unexpected expenses\n"
    
    return result

@tool
def analyze_investment_portfolio(financial_data: str) -> str:
    """Analyze investment portfolio for diversification, returns, and improvement opportunities."""
    # Parse the financial data
    data = json.loads(financial_data) if isinstance(financial_data, str) else financial_data
    
    # Get investments
    investments = data.get("investments", [])
    
    # Calculate total value
    total_value = sum(inv.get("current_value", 0) for inv in investments)
    
    # Categorize investments by type (using symbol as a proxy)
    stocks = [inv for inv in investments if inv.get("symbol") and inv.get("symbol").isalpha()]
    funds = [inv for inv in investments if inv.get("symbol") and any(x in inv.get("symbol", "") for x in ["X", "TX"])]
    crypto = [inv for inv in investments if inv.get("symbol") in ["BTC", "ETH", "LTC"]]
    other = [inv for inv in investments if inv not in stocks + funds + crypto]
    
    # Generate results
    result = "INVESTMENT PORTFOLIO ANALYSIS:\n\n"
    result += f"Total portfolio value: ${total_value:.2f}\n\n"
    
    # Portfolio breakdown
    result += "Portfolio breakdown:\n"
    stocks_value = sum(s.get("current_value", 0) for s in stocks)
    funds_value = sum(f.get("current_value", 0) for f in funds)
    crypto_value = sum(c.get("current_value", 0) for c in crypto)
    other_value = sum(o.get("current_value", 0) for o in other)
    
    if total_value > 0:
        result += f"- Stocks: ${stocks_value:.2f} ({stocks_value/total_value*100:.1f}%)\n"
        result += f"- Funds: ${funds_value:.2f} ({funds_value/total_value*100:.1f}%)\n"
        result += f"- Crypto: ${crypto_value:.2f} ({crypto_value/total_value*100:.1f}%)\n"
        result += f"- Other: ${other_value:.2f} ({other_value/total_value*100:.1f}%)\n"
    
    # Recommendations
    result += "\nINVESTMENT RECOMMENDATIONS:\n"
    
    # Check diversification
    if total_value > 0:
        max_allocation = max(stocks_value, funds_value, crypto_value, other_value) / total_value
        if max_allocation > 0.7:
            result += "- Your portfolio lacks diversification. Consider spreading investments across different asset classes.\n"
            
        # Check crypto allocation
        if crypto_value / total_value > 0.2:
            result += "- Your cryptocurrency allocation is high. Consider reducing exposure to this volatile asset class.\n"
            
        # Check for small investments
        small_investments = [inv for inv in investments if inv.get("current_value", 0) < 100]
        if small_investments and len(small_investments) > 3:
            result += "- Consider consolidating smaller investments to reduce management complexity.\n"
    else:
        result += "- Start building your investment portfolio with low-cost index funds.\n"
    
    # General advice
    result += "- Consider a regular investment plan to build wealth consistently.\n"
    result += "- Review your investment allocation quarterly to ensure it aligns with your goals.\n"
    
    return result