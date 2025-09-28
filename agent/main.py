from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
# Import all financial tools
from tools import analyze_spending_patterns, optimize_debt_repayment, analyze_investment_portfolio, get_financial_score
import os
import json

# Fix SSL issues
os.environ["GRPC_DEFAULT_SSL_ROOTS_FILE_PATH"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = "/etc/ssl/certs/ca-certificates.crt"

load_dotenv()

def load_financial_data():
    """Load financial data from JSON file"""
    # Fix the tuple issue by removing the comma
    path = '../api/minimal_financial_data.json'  
    
    if os.path.exists(path):
        with open(path, 'r') as f:
            data = json.load(f)
            print(f"✅ Loaded financial data from {path}")
            return data
                
    # If no file found, raise error
    raise FileNotFoundError("Could not locate financial data file")

# Financial advice response model that matches our use case
class FinancialAdviceResponse(BaseModel):
    financial_score: int
    key_recommendations: list[str]  # Will contain exactly 3 recommendations

llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0.1)
parser = PydanticOutputParser(pydantic_object=FinancialAdviceResponse)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are a financial advisor focused on optimizing spending and investment strategies.
            
            Analyze the provided financial data with particular attention to:
            - Transaction patterns and spending categories
            - Investment allocations and diversification
            - Income to expense ratio
            
            Your response should include:
            1. A financial wellness score (0-100)
            2. Three specific recommendations to improve financial health:
               - One recommendation on spending habits (e.g., "Reduce fast food spending by $X per month")
               - One recommendation on investment strategy (e.g., "Reallocate X% from crypto to index funds")
               - One recommendation on debt management or savings (e.g., "Increase emergency fund by $X")
            
            Be precise with dollar amounts and percentages when possible.
            Each recommendation should directly help increase the financial wellness score.
            
            Wrap your output in this format and provide no other text:
            {format_instructions}
            """,
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{query}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
).partial(format_instructions=parser.get_format_instructions())

# Use our financial tools instead of search/wiki
tools = [
    get_financial_score,
    analyze_spending_patterns, 
    optimize_debt_repayment,
    analyze_investment_portfolio,
]

agent = create_tool_calling_agent(
    llm=llm,
    prompt=prompt,
    tools=tools
)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=False)

def main():
    try:
        # Load the financial data
        financial_data = load_financial_data()
        
        # Create a query that includes the financial data
        query = f"Analyze my financial situation and provide a personalized financial plan. Here's my financial data: {json.dumps(financial_data)}"
        
        print("\n🤖 Analyzing your financial situation...")
        print("This may take a moment as the AI evaluates your data...\n")
        
        # Run the agent with the financial data
        raw_response = agent_executor.invoke({"query": query})
        output_text = raw_response["output"]

        try:
            structured_response = parser.parse(output_text)
            
            print("\n===== YOUR FINANCIAL ASSESSMENT =====\n")
            print(f"📊 FINANCIAL WELLNESS SCORE: {structured_response.financial_score}/100\n")
            
            print("🎯 KEY RECOMMENDATIONS:")
            for i, rec in enumerate(structured_response.key_recommendations, 1):
                print(f"  {i}. {rec}")
                    
        except Exception as e:
            print(f"Error parsing response: {e}")
            print("\nRaw Financial Advice:")
            print(output_text)
            
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please make sure the financial data file exists at '../api/my_financial_data.json'")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()