# RoomieLoot Backend

A FastAPI backend for RoomieLoot - Financial management for roommates.

## Features

- **User Authentication**: Firebase Auth with Google OAuth
- **Bank Account Linking**: Plaid integration for secure bank connections
- **Transaction Management**: Automatic categorization and transaction fetching
- **REST API**: Comprehensive API endpoints for all functionality

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Setup

Copy the example environment file and configure your credentials:

```bash
cp env_example.txt .env
```

Edit `.env` with your actual values:

```bash
# Plaid Configuration (get from https://dashboard.plaid.com/)
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox

# Firebase Configuration (get from Firebase Console)
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/serviceAccountKey.json

# Database (SQLite for development)
DATABASE_URL=sqlite:///./roomieloot.db
```

### 3. Start the Server

```bash
python start.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /verify` - Verify Firebase token
- `GET /me` - Get current user info
- `POST /link-token` - Create Plaid Link token
- `DELETE /account` - Delete user account

### Bank Accounts (`/api/bank`)
- `POST /link` - Link bank account with Plaid
- `GET /accounts` - Get all linked accounts
- `GET /accounts/{id}` - Get specific account
- `PUT /accounts/{id}/refresh` - Refresh account data
- `DELETE /accounts/{id}` - Unlink account

### Transactions (`/api/transactions`)
- `POST /fetch` - Fetch transactions from Plaid
- `GET /` - Get transactions with filtering
- `GET /summary` - Get transaction summary
- `GET /categories` - Get all categories
- `PUT /{id}/category` - Update transaction category

## Setup Guide

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Authentication → Sign-in method → Google
4. Go to Project Settings → Service Accounts
5. Generate new private key (downloads JSON file)
6. Set `FIREBASE_SERVICE_ACCOUNT_PATH` to the JSON file path

### Plaid Setup

1. Go to [Plaid Dashboard](https://dashboard.plaid.com/)
2. Create a new application
3. Get your `client_id` and `secret` from API section
4. Set `PLAID_ENV=sandbox` for development
5. Add your credentials to `.env`

### Database Setup

The backend uses SQLite by default for development. For production:

1. Install PostgreSQL
2. Create database: `createdb roomieloot`
3. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost/roomieloot
   ```

## Development

### Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── start.py                # Startup script
├── requirements.txt        # Python dependencies
├── env_example.txt         # Environment template
├── auth/
│   └── firebase_auth.py   # Firebase authentication
├── api/
│   ├── auth_routes.py     # Authentication endpoints
│   ├── bank_routes.py     # Bank account endpoints
│   └── transaction_routes.py # Transaction endpoints
├── database/
│   └── database.py        # Database configuration
├── models/
│   └── user.py            # Database models
└── services/
    ├── plaid_service.py   # Plaid integration
    └── transaction_categorizer.py # Auto-categorization
```

### Testing the API

1. **Health Check**: `GET http://localhost:8000/health`
2. **API Docs**: `GET http://localhost:8000/docs`

### Example Usage

1. **Sign Up/Login**: Use Firebase Auth on frontend
2. **Get Link Token**: `POST /api/auth/link-token`
3. **Link Bank Account**: Use Plaid Link with token
4. **Fetch Transactions**: `POST /api/transactions/fetch`
5. **View Transactions**: `GET /api/transactions/`

## Production Deployment

### Environment Variables

Set these in your production environment:

```bash
DATABASE_URL=postgresql://user:pass@host:port/db
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
PLAID_CLIENT_ID=your_production_client_id
PLAID_SECRET=your_production_secret
PLAID_ENV=production
```

### Security Notes

- Never commit `.env` files
- Use environment variables for secrets
- Enable HTTPS in production
- Set up proper CORS origins
- Use a production database (PostgreSQL)

## Troubleshooting

### Common Issues

1. **Firebase Auth Error**: Check service account key path
2. **Plaid Error**: Verify client ID and secret
3. **Database Error**: Ensure database URL is correct
4. **Import Error**: Run `pip install -r requirements.txt`

### Logs

Check the console output for detailed error messages. The server runs with debug logging enabled.

## Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review the error logs
3. Verify environment configuration
4. Test with Plaid sandbox data first
