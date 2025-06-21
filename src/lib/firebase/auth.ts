
'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email: string, password: string): Promise<User | string> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up with email:", error);
    return error.message || "Failed to sign up with email.";
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User | string> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in with email:", error);
    return error.message || "Failed to sign in with email.";
  }
}

export async function signInWithGoogle(): Promise<User | string> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    // Handle specific error codes if needed
    if (error.code === 'auth/popup-closed-by-user') {
      return 'Sign-in popup closed by user.';
    }
    if (error.code === 'auth/configuration-not-found') {
        return 'Firebase authentication configuration not found. Please ensure Google Sign-In is enabled in your Firebase project and your config is correct.';
    }
    return error.message || "Failed to sign in with Google.";
  }
}

export async function signOutUser(): Promise<void | string> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    return error.message || "Failed to sign out.";
  }
}

export function onAuthStateChangedWrapper(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
