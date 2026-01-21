import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);

// --- Google Configuration ---
export const googleProvider = new GoogleAuthProvider();
// Force account selection for Google
googleProvider.setCustomParameters({ 
    prompt: 'select_account' 
});

// --- GitHub Configuration ---
export const githubProvider = new GithubAuthProvider();
// GitHub doesn't strictly support 'select_account' in the same way, 
// but 'allow_signup' ensures the flow is interactive.
githubProvider.setCustomParameters({ 
    allow_signup: 'true' 
});