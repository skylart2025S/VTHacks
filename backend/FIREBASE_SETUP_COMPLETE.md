# 🔥 Firebase Setup Guide for RoomieLoot

## Step-by-Step Firebase Integration

### 1. Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"** or use existing project
3. **Enter project name**: `roomieloot` (or your preferred name)
4. **Disable Google Analytics** (optional for development)
5. **Click "Create project"**

### 2. Enable Authentication

1. **In your Firebase project**, click on **"Authentication"** in the left sidebar
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable "Google" provider**:
   - Click on Google
   - Toggle "Enable"
   - Set Project support email (your email)
   - Click "Save"
5. **Add authorized domains**:
   - Add `localhost` for development
   - Add your production domain when ready

### 3. Get Service Account Key

1. **Go to Project Settings** (gear icon in top left)
2. **Click "Service accounts" tab**
3. **Click "Generate new private key"**
4. **Click "Generate key"** - this downloads a JSON file
5. **Save the file** as `firebase-service-account.json` in your backend folder

### 4. Update Your .env File

**Edit your `.env` file** and change this line:
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json
```

**Make sure the path points to your downloaded JSON file.**

### 5. Test Firebase Integration

Run the test to verify everything works:
```bash
python test_backend.py
```

### 6. Start the Server

Once Firebase is configured:
```bash
python start.py
```

## 🔧 Alternative: Environment Variable Method

Instead of a file, you can use an environment variable:

1. **Copy the entire JSON content** from the downloaded file
2. **Set it in your `.env` file**:
```bash
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}
```

## 🧪 Testing Firebase

### Test Authentication Flow

1. **Start your backend**: `python start.py`
2. **Visit**: `http://localhost:8000/docs`
3. **Test the auth endpoints**:
   - `POST /api/auth/verify` - Verify Firebase token
   - `GET /api/auth/me` - Get current user info

### Frontend Integration

Your frontend will need to:

1. **Install Firebase SDK**:
```bash
npm install firebase
```

2. **Initialize Firebase**:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase config from Project Settings
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    
    // Send token to your backend
    const response = await fetch('http://localhost:8000/api/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const userData = await response.json();
    console.log('User authenticated:', userData);
  } catch (error) {
    console.error('Authentication error:', error);
  }
};
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Firebase service account not configured"**
   - Check your `.env` file has the correct path
   - Make sure the JSON file exists

2. **"Invalid Firebase ID token"**
   - Check your Firebase project settings
   - Verify the service account key is correct

3. **"Permission denied"**
   - Make sure Google Auth is enabled in Firebase Console
   - Check authorized domains include localhost

### Getting Firebase Config:

1. **Go to Project Settings** → **General** tab
2. **Scroll down to "Your apps"**
3. **Click "Add app"** → **Web** (</>) 
4. **Copy the config object**

## ✅ Verification

After setup, you should see:
- ✅ Firebase Admin SDK initialized successfully
- ✅ Server starts without errors
- ✅ API documentation available at `/docs`
- ✅ Authentication endpoints working

## 🎯 Next Steps

Once Firebase is working:
1. **Test authentication** with your frontend
2. **Link bank accounts** with Plaid
3. **Fetch and categorize transactions**
4. **Build your user interface**

Your backend is now ready for full Firebase integration! 🚀
