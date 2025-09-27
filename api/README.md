# RoomieLoot Backend Setup Guide

## Overview
This Flask backend provides Plaid API integration for the RoomieLoot gamified personal finance app. It includes endpoints for financial data retrieval and gamification features like XP, levels, and leaderboards.

## Setup Instructions

### 1. Install Dependencies
```bash
cd VTHacks/api
pip install -r requirements.txt
```

### 2. Configure Environment Variables
1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Get your Plaid API credentials:
   - Go to [Plaid Dashboard](https://dashboard.plaid.com/)
   - Create a new application
   - Copy your `client_id` and `secret` to the `.env` file
   - Make sure to use the sandbox environment for development

3. Update the `.env` file with your credentials:
   ```
   PLAID_CLIENT_ID=your_actual_client_id
   PLAID_SECRET=your_actual_secret
   ```

### 3. Run the Backend
```bash
python app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Plaid Integration
- `GET /api/info` - Get API information
- `POST /api/create_link_token` - Create Plaid Link token
- `POST /api/set_access_token` - Exchange public token for access token
- `GET /api/accounts` - Get user accounts
- `GET /api/transactions` - Get user transactions (with XP calculation)
- `GET /api/balance` - Get account balances

### Gamification
- `GET /api/user/profile` - Get user profile with XP and level
- `GET /api/leaderboard` - Get leaderboard by XP
- `GET /api/achievements` - Get available achievements
- `GET /api/health` - Health check

## Usage Example

### Frontend Integration (JavaScript)
```javascript
// Create Link token
const response = await fetch('http://localhost:8000/api/create_link_token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: 'user123' })
});
const { link_token } = await response.json();

// After Plaid Link success, exchange public token
const exchangeResponse = await fetch('http://localhost:8000/api/set_access_token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    public_token: publicToken,
    user_id: 'user123'
  })
});

// Get transactions with XP
const transactionsResponse = await fetch(
  'http://localhost:8000/api/transactions?user_id=user123&item_id=item123'
);
const { transactions, total_xp_earned, user_xp, user_level } = await transactionsResponse.json();
```

## Gamification Features

### XP System
- Users earn XP based on transaction amounts and categories
- Food transactions give bonus XP
- Entertainment and transportation give smaller bonuses
- Maximum 50 XP per transaction

### Level System
- Levels are calculated as `int(xp / 100) + 1`
- Each level requires 100 XP

### Leaderboards
- Ranked by total XP
- Configurable limit (default 10 users)

### Achievements
- Pre-defined achievements for various milestones
- Expandable system for future achievements

## Development Notes

- Currently uses in-memory storage (replace with database in production)
- Supports multiple users with separate access tokens
- All Plaid API calls include proper error handling
- CORS enabled for frontend communication
- Sandbox environment configured for development

## Next Steps

1. Add database integration (SQLite/PostgreSQL)
2. Implement user authentication
3. Add more sophisticated XP calculations
4. Create achievement unlocking system
5. Add transaction categorization and insights
6. Implement real-time notifications
