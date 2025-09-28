# RoomieLoot Financial Data Uniqueness Testing

This guide explains how to verify that creating a new user generates unique financial data from Plaid sandbox.

## Overview

The system now automatically generates unique financial data for each new user using Plaid's sandbox environment. Each user gets:
- Unique account balances
- Unique transaction histories  
- Unique investment holdings
- Unique Plaid item IDs

## How It Works

### 1. User Registration Flow
When a user registers:
1. User account is created with unique ID
2. Plaid sandbox data is automatically generated
3. Financial data is personalized using user ID as seed
4. Data is returned in registration response

### 2. Data Uniqueness Mechanisms
- **User ID as Seed**: Each user's ID is used to seed randomization
- **Plaid Item Creation**: Each user gets a new Plaid sandbox item
- **Data Variation**: Transaction amounts and balances are slightly randomized per user
- **Unique Metadata**: Each dataset includes user-specific metadata

## Testing the System

### Prerequisites
1. **Start the Next.js server**:
   ```bash
   cd VTHacks
   npm run dev
   ```

2. **Ensure Python dependencies are installed**:
   ```bash
   cd VTHacks/api
   pip install plaid-python python-dotenv requests
   ```

3. **Set up Plaid environment variables** (create `.env` file in `VTHacks/api/`):
   ```
   PLAID_CLIENT_ID=your_client_id
   PLAID_SECRET=your_secret
   PLAID_ENV=sandbox
   ```

### Method 1: Automated Testing Script

Run the comprehensive test script:

```bash
cd VTHacks
python test_financial_data_uniqueness.py
```

This script will:
- Create 5 test users
- Generate financial data for each
- Analyze uniqueness using data hashing
- Generate a detailed report
- Save results to `financial_data_test_results.json`

**Expected Output**:
```
🚀 Starting comprehensive test with 5 users
✅ User testuser_1_1234567890 created successfully
✅ User testuser_2_1234567891 created successfully
...
📊 TEST RESULTS
Total users created: 5
Users with financial data: 5
Unique data sets: 5
Duplicate data sets: 0
🎯 Test Result: ✅ PASSED
```

### Method 2: Manual API Testing

#### Step 1: Create a Test User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser1", "password": "testpass123"}'
```

**Expected Response**:
```json
{
  "message": "Account created successfully with financial data",
  "username": "testuser1",
  "userId": "user_1234567890_abc123def",
  "financialDataGenerated": true,
  "financialData": {
    "accounts": [...],
    "transactions": [...],
    "holdings": [...],
    "metadata": {
      "user_id": "user_1234567890_abc123def",
      "generated_at": "2024-01-15T10:30:00.000Z",
      "item_id": "item_xyz789"
    }
  }
}
```

#### Step 2: Create Another User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser2", "password": "testpass123"}'
```

#### Step 3: Compare the Data
Compare the `financialData` objects from both responses. They should have:
- Different `item_id` values
- Different account balances
- Different transaction amounts
- Different `user_id` in metadata

### Method 3: Generate Additional Data

Test that the same user gets consistent data:

```bash
# Generate additional data for existing user
curl -X POST http://localhost:3000/api/users/USER_ID/financial-data \
  -H "Content-Type: application/json"
```

## Verification Checklist

✅ **Each user gets unique Plaid item ID**
- Check `metadata.item_id` is different for each user

✅ **Account balances are unique**
- Compare `accounts[].balances.current` values
- Should vary slightly between users

✅ **Transaction data is unique**
- Compare transaction amounts and vendors
- Should have different values per user

✅ **Investment holdings are unique**
- Compare `holdings[].quantity` and `holdings[].institution_price`
- Should vary between users

✅ **Metadata includes user identification**
- Check `metadata.user_id` matches the user
- Check `metadata.generated_at` timestamps

## Troubleshooting

### Common Issues

1. **"Server is not running"**
   - Start Next.js server: `npm run dev`
   - Check if port 3000 is available

2. **"Python script failed"**
   - Install Python dependencies: `pip install plaid-python python-dotenv requests`
   - Check Plaid environment variables in `.env` file

3. **"Financial data generation failed"**
   - Verify Plaid credentials are correct
   - Check if Plaid sandbox is accessible
   - Review server logs for detailed error messages

4. **"Duplicate data detected"**
   - This might indicate Plaid sandbox limitations
   - Try creating users with different usernames
   - Check if randomization seed is working properly

### Debug Mode

Enable detailed logging by checking the server console output:
- Look for `🔄 Generating financial data for new user: USER_ID`
- Look for `✅ Financial data generated for user USER_ID`
- Check Python script output for Plaid API responses

## API Endpoints

### User Registration
- **POST** `/api/auth/register`
- Creates user and generates financial data
- Returns user info + financial data

### Financial Data Generation
- **POST** `/api/users/{userId}/financial-data`
- Generates additional financial data for existing user
- Returns fresh Plaid sandbox data

### Health Check
- **GET** `/api/auth/test`
- Verifies API is working

## Database Schema

The system uses Prisma with the following models:

```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  financialData FinancialData?
}

model FinancialData {
  id        String   @id @default(cuid())
  userId    String   @unique
  plaidItemId     String?
  accountsData     Json?
  transactionsData Json?
  holdingsData     Json?
  // ... other fields
}
```

## Production Considerations

For production deployment:

1. **Encrypt Plaid Access Tokens**: Store securely in database
2. **Use Real Plaid Environment**: Switch from sandbox to production
3. **Implement Rate Limiting**: Prevent API abuse
4. **Add Data Validation**: Verify Plaid data integrity
5. **Implement Caching**: Cache financial data appropriately
6. **Add Error Handling**: Graceful fallbacks for Plaid failures

## Success Criteria

The system passes verification when:
- ✅ 80%+ of users receive unique financial data
- ✅ Each user has different Plaid item ID
- ✅ Account balances vary between users
- ✅ Transaction histories are unique
- ✅ Investment holdings differ per user
- ✅ Metadata correctly identifies each user
