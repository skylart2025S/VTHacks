# RoomieLoot - Budget Battle Royale 💰🏆

> **Turn budgeting into epic battles. Compete with friends, master your spending, and climb the leaderboard with AI-powered insights.**

RoomieLoot is a gamified financial management platform that transforms personal finance into an engaging, competitive experience. Connect your bank accounts, track your financial health, compete with friends on leaderboards, and receive AI-powered financial advice to level up your money management skills.

## 🎯 Project Overview

RoomieLoot combines real financial data integration with gaming mechanics to make budgeting fun and motivating. The platform integrates with Plaid's API to fetch your actual bank account and transaction data, calculates your financial wellness score, and creates competitive leaderboards where you can challenge friends to improve their financial habits.

### Key Features

- **🏦 Real Financial Data**: Connect your bank accounts via Plaid API for live transaction and balance data
- **📊 Financial Wellness Scoring**: AI-powered scoring system that evaluates your financial health (0-100)
- **🏆 Competitive Leaderboards**: Compete with friends on financial efficiency and savings goals
- **🤖 AI Financial Advisor**: Personalized financial recommendations and advice
- **🎮 Gamification Elements**: Achievements, badges, and progress tracking
- **📱 Modern Dashboard**: Beautiful, responsive interface with real-time financial insights
- **🔒 Secure Authentication**: Safe user accounts with encrypted financial data

## 🛠 Technology Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.9.2** - Type safety
- **Tailwind CSS 4** - Styling framework
- **Biome** - Linting and formatting

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Flask** - Python web framework for financial services
- **Prisma 6.16.2** - Database ORM
- **PostgreSQL** - Primary database
- **MongoDB** - Additional data storage
- **bcryptjs** - Password hashing

### Financial Integration & Python Ecosystem
- **Plaid API** - Bank account and transaction data
- **Python 3.8+** - Core financial processing language
- **Flask** - Python web services and API endpoints
- **Plaid Python SDK** - Official Plaid integration
- **Custom AI Agent** - Financial advice generation and scoring
- **Financial Data Processing** - Transaction analysis and categorization

### Authentication
- **Custom Session Management** - User authentication
- **bcryptjs** - Secure password hashing

## 📁 Project Structure

```
RoomieLoot/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── register/         # User registration
│   │   │   ├── signin/           # User login
│   │   │   └── session/          # Session management
│   │   ├── rooms/                # Room/group management
│   │   │   ├── create/           # Create new groups
│   │   │   ├── join/             # Join existing groups
│   │   │   └── wishlist/         # Group wishlist (optional feature)
│   │   └── users/                # User data endpoints
│   │       └── [userId]/
│   │           └── financial-data/ # Financial data retrieval
│   ├── components/               # React components
│   │   ├── FinancialAdvisor.tsx  # AI financial advice
│   │   ├── RoomWishlistAndSpectrum.tsx # Group features
│   │   ├── Wishlist.tsx          # Wishlist management
│   │   └── ContributionSpectrum.tsx # Group contribution tracking
│   ├── dashboard/                # Personal financial dashboard
│   ├── room/[roomId]/            # Group/room pages with leaderboards
│   ├── rooms/                    # Group selection
│   └── page.tsx                  # Landing page
├── api/                          # Python Flask API & financial integration
│   ├── plaid_client.py           # Plaid API client
│   ├── get_my_data.py            # Data fetching script
│   ├── generate_user_financial_data.py # Data generation
│   ├── app.py                    # Flask web application
│   ├── routes/                   # Flask API routes
│   ├── models/                   # Python data models
│   ├── services/                 # Business logic services
│   └── requirements.txt          # Python dependencies
├── agent/                        # AI financial advisor
│   ├── main.py                   # Main agent logic
│   ├── calculate_score.py        # Financial wellness scoring
│   └── tools.py                  # Agent tools
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema definition
└── public/                       # Static assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **PostgreSQL** database
- **MongoDB** (optional, for additional storage)
- **Plaid Account** (for financial data integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RoomieLoot/VTHacks
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   cd api
   pip install -r requirements.txt
   cd ..
   ```

4. **Set up Python virtual environment (recommended)**
   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

5. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/roomieloot"
   
   # Plaid API (get from https://dashboard.plaid.com/)
   PLAID_CLIENT_ID=your_client_id_here
   PLAID_SECRET=your_secret_here
   PLAID_ENV=sandbox
   
   # Session secret
   SESSION_SECRET=your_session_secret_here
   ```

6. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

7. **Start the Flask API server**
   ```bash
   cd api
   python app.py  # or flask run
   ```

8. **Run the Next.js development server**
   ```bash
   npm run dev
   ```

9. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 API Documentation

### Next.js API Endpoints

#### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account with automatic financial data generation.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "userId": "string",
  "financialDataGenerated": true
}
```

#### POST `/api/auth/signin`
Sign in to an existing account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

### Group Management Endpoints

#### POST `/api/rooms/create`
Create a new group for financial competition.

**Request Body:**
```json
{
  "roomName": "string"
}
```

#### POST `/api/rooms/join`
Join an existing group.

**Request Body:**
```json
{
  "roomId": "string"
}
```

### Financial Data Endpoints

#### GET `/api/users/[userId]/financial-data`
Get user's financial data including accounts, transactions, and holdings.

**Response:**
```json
{
  "accounts": [...],
  "transactions": [...],
  "holdings": [...],
  "metadata": {...}
}
```

## 🐍 Python Flask API Documentation

### Flask Financial Services

The Flask API provides core financial data processing and AI services:

#### POST `/api/financial/analyze`
Analyze user financial data and generate insights.

**Request Body:**
```json
{
  "userId": "string",
  "financialData": {...}
}
```

**Response:**
```json
{
  "score": 85,
  "recommendations": [...],
  "insights": {...}
}
```

#### POST `/api/financial/generate`
Generate financial data for new users using Plaid sandbox.

**Request Body:**
```json
{
  "userId": "string"
}
```

#### GET `/api/financial/score`
Get current financial wellness score for a user.

**Response:**
```json
{
  "score": 85,
  "breakdown": {
    "balance": 20,
    "investments": 15,
    "credit": 10,
    "spending": 8,
    "diversity": 7,
    "base": 30
  }
}
```

### Python Services

#### PlaidClient Class
- **Purpose**: Handles all Plaid API interactions
- **Methods**:
  - `create_sandbox_item()` - Create test financial data
  - `get_accounts()` - Fetch account information
  - `get_transactions()` - Retrieve transaction history
  - `get_investments()` - Get investment holdings
  - `get_securities()` - Fetch security information

#### Financial Data Processing
- **Transaction Categorization**: Automatic categorization of expenses
- **Balance Analysis**: Real-time account balance monitoring
- **Investment Tracking**: Portfolio analysis and performance metrics
- **Data Transformation**: Convert raw Plaid data to application format

#### AI Financial Agent
- **Scoring Algorithm**: Comprehensive financial wellness calculation
- **Recommendation Engine**: Personalized financial advice generation
- **Data Analysis**: Pattern recognition in spending and saving habits

## 🎮 Features Overview

### 1. Financial Wellness Scoring System
- **Comprehensive Scoring**: 0-100 financial wellness score based on multiple factors
- **Balance Analysis**: Rewards healthy account balances and emergency funds
- **Investment Tracking**: Scores based on investment portfolio diversity and value
- **Credit Utilization**: Monitors credit card usage and debt management
- **Spending Patterns**: Analyzes cash flow and spending habits
- **Account Diversity**: Rewards having multiple account types

### 2. Competitive Leaderboards
- **Real-time Rankings**: Live leaderboard updates based on financial scores
- **Efficiency Metrics**: Tracks financial efficiency percentages
- **Group Competitions**: Compete with friends in private groups
- **Achievement System**: Unlock badges for financial milestones
- **Progress Tracking**: Visual progress indicators and trend analysis

### 3. AI Financial Advisor
- **Personalized Recommendations**: AI-generated advice based on your financial data
- **Category-Based Tips**: Advice across saving, budgeting, investment, and debt
- **Priority System**: High, medium, and low priority recommendations
- **Interactive Chat**: Chat interface for financial questions
- **Smart Insights**: Automated analysis of spending patterns and opportunities

### 4. Real Financial Data Integration
- **Plaid API Integration**: Connect real bank accounts securely
- **Transaction Categorization**: Automatic categorization of expenses
- **Balance Monitoring**: Real-time account balance tracking
- **Investment Holdings**: Track investment portfolios and performance
- **Data Security**: Encrypted storage and secure API connections

### 5. Gamification Elements
- **Financial Score**: Personal financial wellness score (0-100)
- **Achievement Badges**: Unlock badges for financial milestones
- **Progress Bars**: Visual progress tracking for financial goals
- **Streak Tracking**: Maintain financial habits with streak counters
- **Level System**: Level up based on financial improvements

### 6. Group Features (Optional)
- **Group Creation**: Create private groups for friends
- **Shared Wishlists**: Collaborative wishlist for group purchases
- **Group Statistics**: Aggregate financial statistics for groups
- **Social Features**: Share achievements and compete with friends

## 🤖 AI Financial Agent

The project includes a sophisticated Python-based AI agent that provides personalized financial advice:

### Scoring Algorithm Features
- **Balance Analysis**: Evaluates account balances and emergency fund adequacy
- **Investment Assessment**: Analyzes investment portfolio diversity and performance
- **Debt Management**: Monitors credit utilization and debt-to-income ratios
- **Spending Analysis**: Tracks cash flow patterns and spending habits
- **Account Diversity**: Rewards having multiple account types for financial stability

### AI Recommendations
- **Personalized Advice**: Generates 3 key recommendations per user
- **Category-Based Tips**: Covers saving, budgeting, investment, and debt management
- **Priority Scoring**: Ranks recommendations by importance and impact
- **Contextual Insights**: Provides advice based on current financial situation

### Usage
```bash
cd agent
python main.py
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

### Python Development

#### Running Python Services
```bash
# Start Flask API server
cd api
python app.py

# Run financial data generation
python get_my_data.py

# Run AI financial agent
cd ../agent
python main.py
```

#### Python Dependencies
The project uses several Python packages for financial processing:

```bash
# Core dependencies
plaid-python>=11.0.0      # Plaid API integration
python-dotenv>=1.0.0      # Environment variable management
requests>=2.31.0          # HTTP requests

# Additional packages (if Flask is used)
flask>=2.0.0              # Web framework
flask-cors>=3.0.0         # CORS handling
```

#### Virtual Environment Setup
```bash
# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Database Management

- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm run start`
3. Ensure database is accessible from production environment

## 📊 Database Schema

### Users Table
- `id`: Unique user identifier
- `username`: Unique username
- `password`: Hashed password
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Financial Data Table
- `id`: Unique financial data identifier
- `userId`: Reference to user
- `plaidItemId`: Plaid item identifier
- `plaidAccessToken`: Encrypted access token
- `accountsData`: JSON bank account data
- `transactionsData`: JSON transaction data
- `holdingsData`: JSON investment data
- `lastUpdated`: Last sync timestamp

## 🏆 Scoring System Details

### Financial Wellness Score Components (0-100)

1. **Account Balance (0-20 points)**
   - Emergency fund adequacy
   - Liquid account balances
   - Savings account health

2. **Investment Portfolio (0-20 points)**
   - Investment value relative to income
   - Portfolio diversity
   - Long-term wealth building

3. **Credit Utilization (0-10 points)**
   - Credit card usage percentage
   - Debt management
   - Credit health indicators

4. **Spending Habits (0-10 points)**
   - Cash flow analysis
   - Expense categorization
   - Budget adherence

5. **Account Diversity (0-10 points)**
   - Multiple account types
   - Financial product utilization
   - Banking relationship strength

6. **Base Score (30 points)**
   - Starting score for all users
   - Ensures minimum baseline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/api/README.md` for Plaid integration details

## 🔮 Future Enhancements

- Real-time financial notifications
- Mobile app development
- Advanced analytics dashboard
- Integration with more financial institutions
- Enhanced AI recommendations with machine learning
- Social challenges and competitions
- Automated budget goal tracking
- Investment portfolio optimization
- Credit score monitoring
- Bill payment reminders and automation

---

**Built with ❤️ for VTHacks - Making Finance Fun!**