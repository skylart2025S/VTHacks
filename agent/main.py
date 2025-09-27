from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import initialize_agent, AgentType, AgentExecutor
from tools import (
    spending_analysis_tool, budget_optimization_tool, debt_reduction_tool,
    investment_advice_tool, savings_goal_tool, financial_score_tool,
    search_tool, save_tool
)
import json


load_dotenv()


class FinancialAdviceResponse(BaseModel):
    financial_score: int
    key_recommendations: list[str]
    action_plan: list[str]
    tools_used: list[str]
    priority_areas: list[str]


llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1)
parser = PydanticOutputParser(pydantic_object=FinancialAdviceResponse)


# Financial advisory tools
tools = [
    financial_score_tool,
    spending_analysis_tool,
    budget_optimization_tool,
    debt_reduction_tool,
    investment_advice_tool,
    savings_goal_tool,
    search_tool,
    save_tool
]


# The ZERO_SHOT_REACT_DESCRIPTION agent uses its own prompt template
# We can customize the system message through the agent_kwargs if needed


agent_executor = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    return_intermediate_steps=True,
    handle_parsing_errors=True,
    agent_kwargs={
        "prefix": """You are a concise financial advisor AI. Your goal is to provide BRIEF, actionable advice to improve the user's financial score.


IMPORTANT: Your final answer MUST be valid JSON with these fields:
- financial_score (number)
- key_recommendations (array of 3 short strings)
- action_plan (array of 3 actionable steps)
- tools_used (array of tool names you used)
- priority_areas (array of 2-3 focus areas)


Keep recommendations SHORT (1-2 sentences max). Focus on the TOP 3 highest impact changes."""
    }
)


# Demo: Load sample financial data or get user input
print("=== Financial Advisory AI ===")
print("1. Use sample data from API folder")
print("2. Enter your own financial data (JSON)")
choice = input("Choose option (1 or 2): ")


if choice == "1":
    # Load sample data
    try:
        with open('../api/sample.json', 'r') as f:
            financial_data = json.load(f)
        query = f"Analyze my financial situation and provide comprehensive advice. Here's my financial data: {json.dumps(financial_data)}"
    except FileNotFoundError:
        print("Sample data not found. Please ensure sample.json exists in the api folder.")
        query = "Provide general financial advice for building wealth."
else:
    query = input("Please provide your financial data (JSON format) or describe your financial situation: ")


raw_response = agent_executor.invoke({"input": query})


try:
    output_text = raw_response["output"]
   
    # Try to extract JSON from the output if it's embedded in text
    import re
    json_match = re.search(r'\{[^{}]*"financial_score"[^{}]*\}', output_text, re.DOTALL)
    if json_match:
        json_text = json_match.group(0)
        structured_response = parser.parse(json_text)
    else:
        structured_response = parser.parse(output_text)
   
    print(f"\n=== FINANCIAL ANALYSIS RESULTS ===")
    print(f"Financial Score: {structured_response.financial_score}/100")
    print(f"\nKey Recommendations:")
    for i, rec in enumerate(structured_response.key_recommendations, 1):
        print(f"{i}. {rec}")
   
    print(f"\nAction Plan:")
    for i, action in enumerate(structured_response.action_plan, 1):
        print(f"{i}. {action}")
   
    print(f"\nPriority Areas: {', '.join(structured_response.priority_areas)}")
    print(f"Tools Used: {', '.join(structured_response.tools_used)}")
   
except Exception as e:
    print(f"Failed to parse structured response: {e}")
    print(f"\n=== RAW FINANCIAL ADVICE ===")
    output = raw_response.get("output", "No output available")
   
    # Try to extract key insights from the raw output
    print("Key insights from the analysis:")
    lines = output.split('\n')
    for line in lines:
        if any(keyword in line.lower() for keyword in ['recommend', 'should', 'increase', 'reduce', 'pay']):
            if len(line.strip()) > 10 and len(line) < 200:  # Reasonable length
                print(f"• {line.strip()}")
   
    print(f"\nFull output available if needed.")




