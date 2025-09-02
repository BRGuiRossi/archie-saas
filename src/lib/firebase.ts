import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAojyzuLfdgyZ6ny5D-wxT9vbGa2piP8d8",
  authDomain: "archie-saas.firebaseapp.com",
  projectId: "archie-saas",
  storageBucket: "archie-saas.firebasestorage.app",
  messagingSenderId: "742708145888",
  appId: "1:742708145888:web:300810af9cadaff68eaa85"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
