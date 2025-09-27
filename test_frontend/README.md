# 🏠 RoomieLoot Test Frontend

A Next.js frontend application for testing RoomieLoot's core user functionality including authentication, bank account linking, and transaction viewing.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend server running (see `../backend/README.md`)
- Firebase project configured
- Plaid account with sandbox access

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Update `src/lib/firebase.ts` with your Firebase config
   - Ensure Firebase Authentication is enabled with Google provider

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Features

### ✅ Authentication
- **Google OAuth Sign-in** via Firebase Authentication
- **Automatic token management** for backend API calls
- **User session persistence** across browser refreshes

### ✅ Bank Account Linking
- **Plaid Link integration** for secure bank account connection
- **Sandbox environment** for testing with fake bank data
- **Real-time account verification** and linking

### ✅ Transaction Management
- **Automatic transaction fetching** from linked accounts
- **Smart categorization** of transactions
- **Recent transaction display** with filtering options

## 🔧 Configuration

### Firebase Setup
Update `src/lib/firebase.ts` with your Firebase project configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Backend Connection
The frontend automatically connects to the backend at `http://localhost:8000`. Ensure your backend server is running before using the frontend.

## 📱 Usage Guide

### 1. Sign In
- Click "Sign in with Google" button
- Complete Google OAuth flow
- You'll be automatically authenticated

### 2. Link Bank Account
- Click "Link Bank Account" button
- Use Plaid's sandbox credentials:
  - **Phone**: `+1-415-555-0123`
  - **Verification Code**: `1234`
  - **Username**: `user_good`
  - **Password**: `pass_good`
- Select accounts to link
- Complete the linking process

### 3. View Transactions
- After linking accounts, transactions will automatically load
- View categorized transactions with amounts and dates
- Filter by account or transaction type

## 🧪 Testing with Plaid Sandbox

The application uses Plaid's sandbox environment for testing. Use these test credentials:

### Test Credentials
- **Phone Number**: `+1-415-555-0123`
- **Verification Code**: `1234`
- **Username**: `user_good`
- **Password**: `pass_good`

### Test Bank Accounts
The sandbox provides several test accounts:
- Chase Bank
- Wells Fargo
- Bank of America
- And more...

## 🏗️ Project Structure

```
test_frontend/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Main page component
│   ├── components/          # Reusable components
│   │   └── PlaidLink.tsx    # Plaid Link integration
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   └── lib/                 # Utility libraries
│       ├── firebase.ts      # Firebase configuration
│       └── api.ts           # Backend API client
├── public/                  # Static assets
├── package.json             # Dependencies
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔌 API Integration

The frontend communicates with the backend through these endpoints:

- `POST /api/auth/verify` - Verify Firebase token
- `POST /api/auth/link-token` - Create Plaid Link token
- `POST /api/bank/link` - Link bank account
- `GET /api/bank/accounts` - Get linked accounts
- `GET /api/transactions` - Get transactions

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to create link token"**
   - Ensure backend server is running
   - Check Firebase authentication is working
   - Verify Plaid credentials in backend

2. **"Invalid phone number" in Plaid Link**
   - Use the test phone number: `+1-415-555-0123`
   - Don't use your real phone number in sandbox

3. **"Verification code required"**
   - Use the test verification code: `1234`
   - This is always the same in sandbox mode

4. **Firebase authentication errors**
   - Check Firebase configuration in `firebase.ts`
   - Ensure Google provider is enabled in Firebase Console
   - Verify API keys are correct

### Debug Mode
Enable debug logging by opening browser DevTools and checking the Console tab for detailed error messages.

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
For production deployment, set these environment variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_FIREBASE_CONFIG` - Firebase configuration

## 📚 Dependencies

### Core Dependencies
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Firebase** - Authentication
- **Plaid Link** - Bank account linking

### Development Dependencies
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Tailwind CSS** - Styling framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of RoomieLoot and follows the same licensing terms.

---

**Need help?** Check the main project README or contact the development team.