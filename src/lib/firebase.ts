import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-lIOivDKPdRi0rKfibm5tG0L3ukz_Ygo",
  authDomain: "shoe-style-65c37.firebaseapp.com",
  projectId: "shoe-style-65c37",
  storageBucket: "shoe-style-65c37.firebasestorage.app",
  messagingSenderId: "604538304941",
  appId: "1:604538304941:web:56d99b5b249ee5b80a0924",
  measurementId: "G-WZ48EWW9TZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { app, analytics, auth, googleProvider, appleProvider };
