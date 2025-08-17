"use client";

import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

// For demo purposes, we'll hardcode an admin UID.
// In a real application, this would be managed via custom claims or a database role system.
export const ADMIN_UID = "jD4a4t6y8rZp9sXcVbNfGhJlK7x1";


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    return null;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error)
 {
    console.error("Error signing out: ", error);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
