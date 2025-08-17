
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// Conditionally initialize Firebase
let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let googleProvider: GoogleAuthProvider;
let db: ReturnType<typeof getFirestore>;

const firebaseConfigValues = Object.values(firebaseConfig);
const isConfigComplete = firebaseConfigValues.every(value => value);

if (isConfigComplete) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
} else {
  console.warn("Firebase configuration is missing. Firebase features will be disabled.");
  // Provide dummy initializations for types, but they will not be functional
  app = {} as FirebaseApp;
  auth = {} as ReturnType<typeof getAuth>;
  googleProvider = {} as GoogleAuthProvider;
  db = {} as ReturnType<typeof getFirestore>;
}


export { app, auth, googleProvider, db, isConfigComplete };
