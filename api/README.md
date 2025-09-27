# RoomieLoot Plaid API Integration

This project integrates with Plaid's API to fetch financial data from bank accounts and display it in a categorized format.

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd RoomieLoot/VTHacks/api
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Up Plaid Credentials

#### Option A: Get Your Own Plaid Credentials (Recommended)
1. Go to [Plaid Dashboard](https://dashboard.plaid.com/team/api)
2. Sign up for a free account
3. Get your `client_id` and `secret` from the API keys section
4. Copy `env_example.txt` to `.env`:
   ```bash
   copy env_example.txt .env
   ```
5. Edit `.env` with your credentials:
   ```
   PLAID_CLIENT_ID=your_client_id_here
   PLAID_SECRET=your_secret_here
   PLAID_ENV=sandbox
   ```

#### Option B: Use Shared Credentials (Ask Team Lead)
If your team has shared Plaid credentials, ask your team lead for the `.env` file.

### 4. Run the Application
```bash
python get_my_data.py
```

## 📊 What You'll See

The script will display:
- **12 Bank Accounts** with balances
- **16 Transactions** categorized by type
- **13 Investment Holdings**

### Example Output:
```
📋 All Transactions:
    1. KFC, $500.00, 🍔 Food & Dining
    2. Uber 063015 SF**POOL**, $5.40, 🚗 Transportation
    3. Starbucks, $4.33, 🍔 Food & Dining
    4. United Airlines, $500.00, 🚗 Transportation
    ...
```

## 🔧 How It Works

1. **Creates a sandbox item** using Plaid's API
2. **Fetches real financial data** from Plaid's test environment
3. **Categorizes transactions** automatically (Food, Transportation, etc.)
4. **Saves data** to `my_financial_data.json`

## 📁 File Structure

```
api/
├── plaid_client.py          # Main Plaid API client
├── get_my_data.py          # Script to fetch and display data
├── requirements.txt        # Python dependencies
├── .env                    # Your Plaid credentials (create this)
├── env_example.txt         # Template for .env file
├── sample.json            # Reference for data structure
└── my_financial_data.json # Generated data file (auto-created)
```

## 🛠️ Troubleshooting

### "No module named plaid"
```bash
pip install plaid-python python-dotenv
```

### "PLAID_CLIENT_ID and PLAID_SECRET must be set"
- Make sure you have a `.env` file with your Plaid credentials
- Check that the credentials are correct in the Plaid dashboard

### "PRODUCT_NOT_READY" error
- This is normal - the script automatically retries
- Wait a few seconds and it should work

## 🔑 Important Notes

- **This uses Plaid's SANDBOX environment** - all data is fake/test data
- **Each run creates new test data** with different transaction IDs
- **No real bank accounts are accessed** - it's all simulated
- **The `my_financial_data.json` file regenerates** every time you run the script

## 📞 Need Help?

1. **Check the Plaid Dashboard** - Make sure your credentials are active
2. **Ask your team lead** - They can help with Plaid setup
3. **Check the logs** - The script shows detailed error messages

## 🎯 Next Steps

Once this is working, you can:
- Integrate this data into your main RoomieLoot application
- Use the `plaid_client.py` in your backend
- Customize the transaction categories
- Add more financial data types (investments, etc.)

---

**Happy coding! 🚀**
