
// src/lib/firebase/config.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// User-provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOJYZXFxjcdN9VR_DQNofU8prM0ZSmayI",
  authDomain: "algoflow-tracker-cfa61.firebaseapp.com",
  projectId: "algoflow-tracker-cfa61",
  storageBucket: "algoflow-tracker-cfa61.appspot.com",
  messagingSenderId: "882980202967",
  appId: "1:882980202967:web:f6fcdb333d1aea8dac8392",
  measurementId: "G-PTLY0SVJ8P"
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

// Enable Firestore offline persistence
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore offline persistence enabled.");
    })
    .catch((err) => {
      if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a time.
        console.warn('Firestore persistence failed (multiple tabs open or other precondition). Consider using enableMultiTabIndexedDbPersistence.');
      } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        console.warn('Firestore persistence not supported in this browser.');
      } else {
        console.error('Firestore persistence error:', err);
      }
    });
} catch (e) {
    console.error("Error attempting to enable Firestore persistence:", e);
}

export { app, auth, db };
