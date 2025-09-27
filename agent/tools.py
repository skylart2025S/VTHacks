from langchain_community.tools import WikipediaQueryRun, DuckDuckGoSearchRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain.tools import Tool, BaseTool
from datetime import datetime
import json
from typing import Dict, List, Any
from collections import defaultdict


def calculate_financial_score(data: dict) -> dict:
    """Calculate comprehensive financial health score"""
    score = 0
    breakdown = {}
   
    # Get financial metrics
    accounts = data.get('accounts', [])
    transactions = data.get('transactions', [])
    income_data = data.get('income', {})
   
    # Calculate basic metrics
    total_checking = sum(acc['balances']['current'] for acc in accounts if acc['subtype'] == 'checking')
    total_savings = sum(acc['balances']['current'] for acc in accounts if acc['subtype'] == 'savings')
    total_credit_used = sum(max(0, acc['balances']['limit'] - acc['balances']['available'])
                           for acc in accounts if acc['subtype'] == 'credit card' and acc['balances']['limit'])
    total_credit_limit = sum(acc['balances']['limit'] for acc in accounts
                           if acc['subtype'] == 'credit card' and acc['balances']['limit'])
   
    monthly_income = income_data.get('income_streams', [{}])[0].get('monthly_income', 0)
   
    # Calculate monthly expenses (last 30 days of transactions)
    monthly_expenses = sum(tx['amount'] for tx in transactions
                          if tx['amount'] > 0 and 'Deposit' not in tx.get('category', []))
   
    # 1. Credit Utilization (30% of score)
    if total_credit_limit > 0:
        credit_utilization = total_credit_used / total_credit_limit
        if credit_utilization < 0.10:
            score += 30
            breakdown['credit_util'] = "Excellent (< 10%)"
        elif credit_utilization < 0.30:
            score += 20
            breakdown['credit_util'] = "Good (< 30%)"
        else:
            score += 5
            breakdown['credit_util'] = f"Needs Improvement ({credit_utilization:.1%})"
    else:
        score += 15  # Neutral if no credit cards
        breakdown['credit_util'] = "No credit cards"
   
    # 2. Savings Rate (25% of score)
    if monthly_income > 0:
        savings_rate = (monthly_income - monthly_expenses) / monthly_income
        if savings_rate > 0.20:
            score += 25
            breakdown['savings_rate'] = f"Excellent ({savings_rate:.1%})"
        elif savings_rate > 0.10:
            score += 15
            breakdown['savings_rate'] = f"Good ({savings_rate:.1%})"
        else:
            score += 5
            breakdown['savings_rate'] = f"Needs Improvement ({savings_rate:.1%})"
   
    # 3. Emergency Fund (20% of score)
    emergency_fund = total_savings
    if monthly_expenses > 0:
        months_expenses = emergency_fund / monthly_expenses
        if months_expenses >= 6:
            score += 20
            breakdown['emergency_fund'] = f"Excellent ({months_expenses:.1f} months)"
        elif months_expenses >= 3:
            score += 12
            breakdown['emergency_fund'] = f"Good ({months_expenses:.1f} months)"
        else:
            score += 3
            breakdown['emergency_fund'] = f"Needs Improvement ({months_expenses:.1f} months)"
   
    # 4. Investment Diversification (15% of score)
    holdings = data.get('holdings', [])
    if holdings:
        total_investment_value = sum(h['institution_value'] for h in holdings)
        if total_investment_value > monthly_income * 3:  # 3+ months of income invested
            score += 15
            breakdown['investments'] = "Excellent diversification"
        else:
            score += 8
            breakdown['investments'] = "Good start on investments"
    else:
        breakdown['investments'] = "No investments detected"
   
    # 5. Debt-to-Income Ratio (10% of score)
    total_debt = total_credit_used
    if monthly_income > 0:
        debt_to_income = total_debt / monthly_income
        if debt_to_income < 0.20:
            score += 10
            breakdown['debt_ratio'] = f"Excellent ({debt_to_income:.1%})"
        elif debt_to_income < 0.40:
            score += 6
            breakdown['debt_ratio'] = f"Good ({debt_to_income:.1%})"
        else:
            breakdown['debt_ratio'] = f"Needs Improvement ({debt_to_income:.1%})"
   
    return {
        'score': min(score, 100),
        'breakdown': breakdown,
        'metrics': {
            'monthly_income': monthly_income,
            'monthly_expenses': monthly_expenses,
            'total_savings': total_savings,
            'total_debt': total_debt,
            'credit_utilization': credit_utilization if total_credit_limit > 0 else 0
        }
    }


class SpendingAnalysisTool(BaseTool):
    name: str = "analyze_spending_patterns"
    description: str = "Analyze spending by category and identify optimization opportunities from user's financial data"
   
    def _run(self, financial_data_json: str) -> str:
        try:
            data = json.loads(financial_data_json)
            transactions = data.get('transactions', [])
           
            # Analyze spending by category
            category_spending = defaultdict(float)
            monthly_total = 0
           
            for tx in transactions:
                if tx['amount'] > 0 and 'Deposit' not in tx.get('category', []):
                    main_category = tx.get('category', ['Other'])[0]
                    category_spending[main_category] += tx['amount']
                    monthly_total += tx['amount']
           
            # Find top spending categories
            sorted_categories = sorted(category_spending.items(), key=lambda x: x[1], reverse=True)
           
            analysis = f"SPENDING ANALYSIS:\n"
            analysis += f"Total Monthly Spending: ${monthly_total:.2f}\n\n"
            analysis += "Top Spending Categories:\n"
           
            for i, (category, amount) in enumerate(sorted_categories[:5], 1):
                percentage = (amount / monthly_total) * 100 if monthly_total > 0 else 0
                analysis += f"{i}. {category}: ${amount:.2f} ({percentage:.1f}%)\n"
           
            # Identify optimization opportunities
            analysis += "\nOPTIMIZATION OPPORTUNITIES:\n"
            if category_spending.get('Food and Drink', 0) > monthly_total * 0.15:
                analysis += "• Dining expenses exceed 15% of spending - consider meal planning\n"
            if category_spending.get('Transportation', 0) > monthly_total * 0.20:
                analysis += "• Transportation costs are high - explore carpooling or public transit\n"
            if category_spending.get('Shops', 0) > monthly_total * 0.10:
                analysis += "• Shopping expenses high - implement a 24-hour rule for non-essential purchases\n"
               
            return analysis
           
        except Exception as e:
            return f"Error analyzing spending: {str(e)}"


class BudgetOptimizationTool(BaseTool):
    name: str = "optimize_budget"
    description: str = "Generate specific budget recommendations using 50/30/20 rule and user's financial data"
   
    def _run(self, financial_data_json: str) -> str:
        try:
            data = json.loads(financial_data_json)
            income_data = data.get('income', {})
            monthly_income = income_data.get('income_streams', [{}])[0].get('monthly_income', 0)
           
            if monthly_income == 0:
                return "No income data available for budget optimization"
           
            # 50/30/20 Rule calculations
            needs_budget = monthly_income * 0.50  # Housing, utilities, groceries, minimum debt payments
            wants_budget = monthly_income * 0.30  # Entertainment, dining out, hobbies
            savings_budget = monthly_income * 0.20  # Emergency fund, retirement, investments
           
            # Calculate current spending
            transactions = data.get('transactions', [])
            current_expenses = sum(tx['amount'] for tx in transactions
                                 if tx['amount'] > 0 and 'Deposit' not in tx.get('category', []))
           
            optimization = f"BUDGET OPTIMIZATION (50/30/20 Rule):\n"
            optimization += f"Monthly Income: ${monthly_income:.2f}\n\n"
           
            optimization += f"RECOMMENDED ALLOCATION:\n"
            optimization += f"• Needs (50%): ${needs_budget:.2f}\n"
            optimization += f"  - Housing, utilities, groceries, minimum debt payments\n"
            optimization += f"• Wants (30%): ${wants_budget:.2f}\n"  
            optimization += f"  - Entertainment, dining out, shopping, hobbies\n"
            optimization += f"• Savings (20%): ${savings_budget:.2f}\n"
            optimization += f"  - Emergency fund, retirement, investments\n\n"
           
            optimization += f"CURRENT STATUS:\n"
            optimization += f"Current Expenses: ${current_expenses:.2f}\n"
           
            if current_expenses > monthly_income * 0.80:
                optimization += "⚠️  Spending exceeds recommended 80% - prioritize expense reduction\n"
           
            # Specific recommendations
            optimization += f"\nSPECIFIC RECOMMENDATIONS:\n"
            optimization += f"• Set up automatic transfer of ${savings_budget:.2f} to savings\n"
            optimization += f"• Limit discretionary spending to ${wants_budget:.2f}/month\n"
            optimization += f"• Track essential expenses to stay under ${needs_budget:.2f}\n"
           
            return optimization
           
        except Exception as e:
            return f"Error optimizing budget: {str(e)}"


class DebtReductionTool(BaseTool):
    name: str = "debt_payoff_strategy"
    description: str = "Calculate optimal debt payoff strategies (avalanche vs snowball) from user's credit card data"
   
    def _run(self, financial_data_json: str) -> str:
        try:
            data = json.loads(financial_data_json)
            accounts = data.get('accounts', [])
           
            # Find credit card debts
            credit_cards = [acc for acc in accounts if acc['subtype'] == 'credit card']
            debts = []
           
            for card in credit_cards:
                if card['balances']['limit'] and card['balances']['available']:
                    debt_amount = card['balances']['limit'] - card['balances']['available']
                    if debt_amount > 0:
                        # Estimate APR from card name or use average
                        apr = 0.199  # Default 19.9% APR
                        if '12.5%' in card.get('official_name', ''):
                            apr = 0.125
                       
                        debts.append({
                            'name': card['name'],
                            'balance': debt_amount,
                            'apr': apr,
                            'min_payment': debt_amount * 0.02  # Estimate 2% minimum
                        })
           
            if not debts:
                return "No credit card debt detected. Great job maintaining financial health!"
           
            total_debt = sum(d['balance'] for d in debts)
            total_min_payments = sum(d['min_payment'] for d in debts)
           
            strategy = f"DEBT PAYOFF STRATEGY:\n"
            strategy += f"Total Debt: ${total_debt:.2f}\n"
            strategy += f"Total Minimum Payments: ${total_min_payments:.2f}/month\n\n"
           
            # Sort for avalanche (highest APR first)
            avalanche_order = sorted(debts, key=lambda x: x['apr'], reverse=True)
            # Sort for snowball (lowest balance first)  
            snowball_order = sorted(debts, key=lambda x: x['balance'])
           
            strategy += "AVALANCHE METHOD (Pay highest APR first):\n"
            for i, debt in enumerate(avalanche_order, 1):
                strategy += f"{i}. {debt['name']}: ${debt['balance']:.2f} at {debt['apr']:.1%} APR\n"
           
            strategy += "\nSNOWBALL METHOD (Pay lowest balance first):\n"
            for i, debt in enumerate(snowball_order, 1):
                strategy += f"{i}. {debt['name']}: ${debt['balance']:.2f}\n"
           
            strategy += f"\nRECOMMENDATION:\n"
            if len(debts) > 2:
                strategy += "• Use AVALANCHE method to save on interest\n"
            else:
                strategy += "• Either method works well with few debts\n"
            strategy += f"• Pay minimums on all cards, then extra on priority card\n"
            strategy += f"• Consider balance transfer to 0% APR card if available\n"
           
            return strategy
           
        except Exception as e:
            return f"Error calculating debt strategy: {str(e)}"


class InvestmentAdviceTool(BaseTool):
    name: str = "investment_advice"
    description: str = "Provide investment recommendations based on user's financial situation and existing portfolio"
   
    def _run(self, financial_data_json: str) -> str:
        try:
            data = json.loads(financial_data_json)
            holdings = data.get('holdings', [])
            securities = data.get('securities', [])
            income_data = data.get('income', {})
           
            monthly_income = income_data.get('income_streams', [{}])[0].get('monthly_income', 0)
            total_investment_value = sum(h['institution_value'] for h in holdings)
           
            advice = f"INVESTMENT ANALYSIS & RECOMMENDATIONS:\n"
           
            if holdings:
                advice += f"Current Portfolio Value: ${total_investment_value:.2f}\n"
               
                # Analyze current holdings
                for holding in holdings[:3]:  # Show top 3 holdings
                    security = next((s for s in securities if s['security_id'] == holding['security_id']), {})
                    gain_loss = holding['institution_value'] - holding['cost_basis']
                    gain_loss_pct = (gain_loss / holding['cost_basis']) * 100 if holding['cost_basis'] > 0 else 0
                   
                    advice += f"• {security.get('name', 'Unknown')}: ${holding['institution_value']:.2f} "
                    advice += f"({gain_loss_pct:+.1f}%)\n"
               
                advice += f"\nPORTFOLIO ASSESSMENT:\n"
                if len(holdings) < 3:
                    advice += "• Portfolio needs more diversification\n"
                if total_investment_value < monthly_income * 6:
                    advice += "• Consider increasing investment contributions\n"
            else:
                advice += "No current investments detected.\n"
           
            advice += f"\nRECOMMENDATIONS:\n"
           
            # Age-based recommendations (assuming working age)
            advice += f"• Target allocation: 70% stocks, 20% bonds, 10% alternatives\n"
            advice += f"• Low-cost index funds (S&P 500, Total Market)\n"
            advice += f"• Consider target-date funds for automatic rebalancing\n"
           
            if monthly_income > 0:
                recommended_investment = monthly_income * 0.15  # 15% of income
                advice += f"• Recommended monthly investment: ${recommended_investment:.2f}\n"
           
            advice += f"• Max out employer 401(k) match first\n"
            advice += f"• Then contribute to Roth IRA ($6,500 annual limit)\n"
            advice += f"• Emergency fund should be 6 months expenses before aggressive investing\n"
           
            return advice
           
        except Exception as e:
            return f"Error providing investment advice: {str(e)}"


class SavingsGoalTool(BaseTool):
    name: str = "savings_goal_tracker"
    description: str = "Calculate savings goals and create actionable plans based on user's financial capacity"
   
    def _run(self, financial_data_json: str) -> str:
        try:
            data = json.loads(financial_data_json)
           
            # Calculate available savings capacity
            score_data = calculate_financial_score(data)
            metrics = score_data['metrics']
           
            monthly_income = metrics['monthly_income']
            monthly_expenses = metrics['monthly_expenses']
            available_for_savings = monthly_income - monthly_expenses
            current_savings = metrics['total_savings']
           
            goals = f"SAVINGS GOAL PLANNING:\n"
            goals += f"Current Savings: ${current_savings:.2f}\n"
            goals += f"Monthly Available for Savings: ${available_for_savings:.2f}\n\n"
           
            # Common savings goals with timelines
            emergency_goal = monthly_expenses * 6
            house_downpayment = 60000  # Assume $300k house, 20% down
            vacation_goal = 5000
            car_goal = 25000
           
            goals += f"RECOMMENDED SAVINGS GOALS:\n"
           
            # Emergency Fund
            emergency_needed = max(0, emergency_goal - current_savings)
            if emergency_needed > 0 and available_for_savings > 0:
                months_to_emergency = emergency_needed / available_for_savings
                goals += f"1. Emergency Fund: ${emergency_goal:.2f}\n"
                goals += f"   Need: ${emergency_needed:.2f} ({months_to_emergency:.1f} months)\n"
            else:
                goals += f"1. Emergency Fund: ✅ Complete!\n"
           
            # Other goals (assuming 50% of available savings after emergency fund)
            discretionary_savings = available_for_savings * 0.5 if available_for_savings > 0 else 0
           
            if discretionary_savings > 0:
                goals += f"\n2. House Down Payment (${house_downpayment}): "
                goals += f"{house_downpayment / discretionary_savings:.1f} months\n"
               
                goals += f"3. Vacation Fund (${vacation_goal}): "
                goals += f"{vacation_goal / discretionary_savings:.1f} months\n"
               
                goals += f"4. Car Fund (${car_goal}): "
                goals += f"{car_goal / discretionary_savings:.1f} months\n"
           
            goals += f"\nACTIONABLE STEPS:\n"
            if available_for_savings <= 0:
                goals += f"• Focus on expense reduction before setting savings goals\n"
                goals += f"• Review budget optimization recommendations\n"
            else:
                goals += f"• Set up automatic transfers: ${available_for_savings * 0.8:.2f}/month\n"
                goals += f"• Use high-yield savings account (4-5% APY)\n"
                goals += f"• Track progress monthly\n"
                goals += f"• Consider separate accounts for each goal\n"
           
            return goals
           
        except Exception as e:
            return f"Error creating savings plan: {str(e)}"


class FinancialScoreTool(BaseTool):
    name: str = "calculate_financial_score"
    description: str = "Calculate comprehensive financial health score and provide detailed breakdown"
   
    def _run(self, financial_data_json: str) -> str:
        try:
            data = json.loads(financial_data_json)
            score_data = calculate_financial_score(data)
           
            result = f"FINANCIAL HEALTH SCORE: {score_data['score']}/100\n\n"
            result += f"DETAILED BREAKDOWN:\n"
           
            for category, status in score_data['breakdown'].items():
                result += f"• {category.replace('_', ' ').title()}: {status}\n"
           
            result += f"\nKEY METRICS:\n"
            metrics = score_data['metrics']
            result += f"• Monthly Income: ${metrics['monthly_income']:.2f}\n"
            result += f"• Monthly Expenses: ${metrics['monthly_expenses']:.2f}\n"
            result += f"• Total Savings: ${metrics['total_savings']:.2f}\n"
            result += f"• Total Debt: ${metrics['total_debt']:.2f}\n"
            result += f"• Credit Utilization: {metrics['credit_utilization']:.1%}\n"
           
            # Score interpretation
            score = score_data['score']
            if score >= 90:
                result += f"\n🌟 EXCELLENT financial health! You're doing great!"
            elif score >= 75:
                result += f"\n✅ GOOD financial health with room for improvement"
            elif score >= 60:
                result += f"\n⚠️  FAIR financial health - focus on key areas"
            else:
                result += f"\n🚨 NEEDS IMPROVEMENT - prioritize financial stability"
           
            return result
           
        except Exception as e:
            return f"Error calculating financial score: {str(e)}"


def save_to_txt(data: str, filename: str ="research_output_txt"):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    formatted_text = f"--- Research Output --- \nTimestamp: {timestamp} \n\n{data}\n"


    with open(filename, "a", encoding="utf-8") as f:
        f.write(formatted_text)


    return "Data saved to {filename}"


save_tool = Tool(
    name="save_text_to_file",
    func=save_to_txt,
    description="Saves structured research output to a text file",
)


# Initialize financial tools
spending_analysis_tool = SpendingAnalysisTool()
budget_optimization_tool = BudgetOptimizationTool()
debt_reduction_tool = DebtReductionTool()
investment_advice_tool = InvestmentAdviceTool()
savings_goal_tool = SavingsGoalTool()
financial_score_tool = FinancialScoreTool()


# Web search tools (optional for additional research)
search = DuckDuckGoSearchRun()
search_tool = Tool(
    name="Search",
    func=search.run,
    description="Search the web for financial information and market data",
)


api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=100)
wiki_tool = WikipediaQueryRun(api_wrapper=api_wrapper)  