import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDOLoNGsJCzv8DrdeWgPnssx4_ZQKip3PI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'emistri-2db9c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'emistri-2db9c',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'emistri-2db9c.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '154249982036',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:154249982036:web:710ded702c19623c047dc1',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-E98HJTHQBB',
};

// Initialize Firebase App (Singleton Pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Configure Google Provider prompt behavior
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const storage = getStorage(app);
export const db = getFirestore(app);

// Initialize Firebase Analytics safely (with browser environment & support check)
export let analytics = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
        console.log('📊 Firebase Analytics initialized (Measurement ID:', firebaseConfig.measurementId, ')');
      }
    })
    .catch((err) => {
      console.warn('Firebase Analytics check note:', err.message || err);
    });
}

export default app;
