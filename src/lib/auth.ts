
"use client";

import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider, isConfigComplete } from "./firebase";

// For demo purposes, we'll hardcode an admin email.
// In a real application, this would be managed via custom claims or a database role system.
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;


export const signInWithGoogle = async () => {
  if (!isConfigComplete) {
    console.error("Firebase is not configured. Cannot sign in.");
    // Return null instead of throwing an error to be handled by the UI
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    return null;
  }
};

export const signOut = async () => {
   if (!isConfigComplete) {
    console.error("Firebase is not configured. Cannot sign out.");
    return;
  }
  try {
    await firebaseSignOut(auth);
  } catch (error)
 {
    console.error("Error signing out: ", error);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
   if (!isConfigComplete) {
    console.warn("Firebase is not configured. Auth state changes will not be monitored.");
    // Immediately call back with null user and return a no-op unsubscribe function
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
