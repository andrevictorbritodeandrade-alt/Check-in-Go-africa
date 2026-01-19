import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Environment variables check - handling multiple potential prefixes for flexibility
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase Safely
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseInitialized = false;

/**
 * Validation to prevent 'auth/invalid-api-key' crash.
 * Firebase throws this if the key is empty, undefined, or the literal string "undefined".
 */
const isValidConfig = (config: any) => {
  return (
    config.apiKey && 
    config.apiKey !== "undefined" && 
    config.apiKey.length > 10 && // API keys are typically long strings
    config.projectId && 
    config.projectId !== "undefined"
  );
};

if (isValidConfig(firebaseConfig)) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseInitialized = true;
    console.log("[Firebase] Initialized successfully.");
  } catch (error) {
    console.error("[Firebase] Initialization failed during setup:", error);
  }
} else {
  console.warn("[Firebase] Config missing or invalid. App is running in LOCAL-ONLY mode.");
}

// Helper functions for data sync (Preserved for App Functionality)
const USER_ID = "default_user_v1";

const notifySyncStatus = (status: 'saving' | 'saved' | 'error') => {
  const event = new CustomEvent('sync-status', { detail: status });
  window.dispatchEvent(event);
};

export const syncDataToCloud = async (collectionName: string, data: any) => {
  if (!isFirebaseInitialized || !db) {
    // Fail silently in offline mode to avoid cluttering the console,
    // just a debug message for the developer.
    console.debug(`[Offline Mode] Local data saved. Cloud sync skipped for ${collectionName}.`);
    return;
  }

  try {
    notifySyncStatus('saving');
    await setDoc(doc(db, collectionName, USER_ID), {
      ...data,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    
    setTimeout(() => {
        notifySyncStatus('saved');
    }, 500);
    
  } catch (e) {
    console.error(`[Firebase] Error syncing to ${collectionName}:`, e);
    notifySyncStatus('error');
  }
};

export const loadDataFromCloud = async (collectionName: string) => {
  if (!isFirebaseInitialized || !db) {
    return null;
  }

  try {
    const docRef = doc(db, collectionName, USER_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (e) {
    console.error(`[Firebase] Error loading from ${collectionName}:`, e);
    return null;
  }
};

export { db, auth };