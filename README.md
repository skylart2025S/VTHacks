# RoomieLoot - Budget Battle Royale 🏠💰

> **Split your finances, not your friendships**

RoomieLoot is a gamified financial management platform designed for roommates to track shared expenses, compete in budget challenges, and make smart financial decisions together. Turn budgeting into epic battles where you compete with friends, master your spending, and climb the leaderboard with AI-powered insights.

## 🎯 Project Overview

RoomieLoot combines financial data integration with social gaming elements to make budgeting fun and collaborative. The platform integrates with Plaid's API to fetch real financial data, provides AI-powered financial advice, and creates a competitive environment where roommates can track shared expenses and contribute to group wishlists.

### Key Features

- **🏦 Financial Data Integration**: Real-time bank account and transaction data via Plaid API
- **🏠 Room Management**: Create and join rooms with roommates
- **📊 Contribution Tracking**: Track who contributes what to shared expenses
- **🎁 Shared Wishlist**: Collaborative wishlist with contribution progress
- **🤖 AI Financial Advisor**: Personalized financial advice and recommendations
- **🏆 Gamification**: Leaderboards, scores, and achievements
- **📱 Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## 🛠 Technology Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.9.2** - Type safety
- **Tailwind CSS 4** - Styling framework
- **Biome** - Linting and formatting

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma 6.16.2** - Database ORM
- **PostgreSQL** - Primary database
- **MongoDB** - Additional data storage
- **bcryptjs** - Password hashing

### Financial Integration
- **Plaid API** - Bank account and transaction data
- **Python Scripts** - Financial data processing
- **Custom AI Agent** - Financial advice generation

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
│   │   ├── rooms/                # Room management
│   │   │   ├── create/           # Create new rooms
│   │   │   ├── join/             # Join existing rooms
│   │   │   ├── wishlist/         # Shared wishlist management
│   │   │   └── contributions/    # Contribution tracking
│   │   └── users/                # User data endpoints
│   ├── components/               # React components
│   │   ├── FinancialAdvisor.tsx  # AI financial advice
│   │   ├── RoomWishlistAndSpectrum.tsx # Room features
│   │   ├── Wishlist.tsx          # Wishlist management
│   │   └── ContributionSpectrum.tsx # Contribution tracking
│   ├── dashboard/                # User dashboard
│   ├── room/[roomId]/            # Individual room pages
│   ├── rooms/                    # Room selection
│   └── page.tsx                  # Landing page
├── api/                          # Python financial integration
│   ├── plaid_client.py           # Plaid API client
│   ├── get_my_data.py            # Data fetching script
│   ├── generate_user_financial_data.py # Data generation
│   └── requirements.txt          # Python dependencies
├── agent/                        # AI financial advisor
│   ├── main.py                   # Main agent logic
│   ├── calculate_score.py        # Scoring algorithms
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

4. **Set up environment variables**
   
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

5. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

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

### Room Management Endpoints

#### POST `/api/rooms/create`
Create a new room.

**Request Body:**
```json
{
  "roomName": "string"
}
```

#### POST `/api/rooms/join`
Join an existing room.

**Request Body:**
```json
{
  "roomId": "string"
}
```

#### GET `/api/rooms/wishlist`
Get wishlist items for a room.

**Query Parameters:**
- `roomId`: Room identifier

#### POST `/api/rooms/wishlist`
Add a new wishlist item.

**Request Body:**
```json
{
  "roomId": "string",
  "itemName": "string",
  "description": "string",
  "estimatedCost": number,
  "priority": "low" | "medium" | "high",
  "category": "string"
}
```

### Financial Data Endpoints

#### GET `/api/users/[userId]/financial-data`
Get user's financial data.

**Response:**
```json
{
  "accounts": [...],
  "transactions": [...],
  "holdings": [...],
  "metadata": {...}
}
```

## 🎮 Features Overview

### 1. User Authentication & Registration
- Secure user registration and login
- Automatic financial data generation for new users
- Session management

### 2. Room Management
- Create rooms with custom names
- Join rooms via room ID
- Member management and tracking
- Room statistics and analytics

### 3. Financial Data Integration
- Real-time bank account data via Plaid
- Transaction categorization and analysis
- Investment holdings tracking
- Financial health scoring

### 4. Shared Wishlist System
- Collaborative wishlist creation
- Priority-based item organization
- Contribution tracking and progress bars
- Category-based organization

### 5. Contribution Spectrum
- Visual representation of member contributions
- Ranking system with leaderboards
- Fairness tracking and analysis
- Contribution history

### 6. AI Financial Advisor
- Personalized financial recommendations
- Category-based advice (saving, budgeting, investment, debt)
- Priority-based tip system
- Interactive chat interface

### 7. Gamification Elements
- User scoring system
- Achievement badges
- Leaderboards and rankings
- Progress tracking

## 🤖 AI Financial Agent

The project includes a Python-based AI agent that provides personalized financial advice:

### Features
- **Financial Data Analysis**: Processes user transaction and account data
- **Personalized Recommendations**: Generates 3 key recommendations per user
- **Scoring System**: Calculates financial health scores
- **Category-Based Advice**: Provides advice across different financial categories

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

- Real-time notifications
- Mobile app development
- Advanced analytics dashboard
- Integration with more financial institutions
- Enhanced AI recommendations
- Social features and challenges
- Expense splitting automation
- Budget goal tracking

---

**Built with ❤️ for VTHacks**