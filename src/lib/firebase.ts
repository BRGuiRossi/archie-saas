import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "archieai-a3yqp",
  appId: "1:631589704183:web:78443c850195acc2fb5ef2",
  storageBucket: "archieai-a3yqp.firebasestorage.app",
  apiKey: "AIzaSyAKzy0oetT96qm5n7O_xjMnUo3ipyAa2s8",
  authDomain: "archieai-a3yqp.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "631589704183"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
