// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC-lVMZr7MOQyqCtO4smbhWc-EjVhoYfPg",
    authDomain: "roomieloot.firebaseapp.com",
    projectId: "roomieloot",
    storageBucket: "roomieloot.firebasestorage.app",
    messagingSenderId: "487973737075",
    appId: "1:487973737075:web:54906a6a1ed72c8bc91006",
    measurementId: "G-882KKLWVQX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
