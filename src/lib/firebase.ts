// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "club-central-o4rm2",
  appId: "1:1069899205847:web:5b5bc82e816f7a6d81b492",
  storageBucket: "club-central-o4rm2.firebasestorage.app",
  apiKey: "AIzaSyBHYiRbCc1RbQT9YqXuE1hcTmK7eYUR69o",
  authDomain: "club-central-o4rm2.firebaseapp.com",
  messagingSenderId: "1069899205847",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
