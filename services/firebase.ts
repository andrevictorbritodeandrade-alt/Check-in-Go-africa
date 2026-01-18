import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Firebase configuration for project "Chaveunica"
const firebaseConfig = {
  apiKey: "AIzaSyD_C_yn_RyBSopY7Tb9aqLW8akkXJR94Vg",
  authDomain: "chaveunica-225e0.firebaseapp.com",
  projectId: "chaveunica-225e0",
  storageBucket: "chaveunica-225e0.firebasestorage.app",
  messagingSenderId: "324211037832",
  appId: "1:324211037832:web:362a46e6446ea37b85b13d",
  measurementId: "G-MRBDJC3QXZ"
};

// Initialize Firebase Safely
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  isFirebaseInitialized = true;
  console.log("[Firebase] Initialized successfully with Chaveunica.");
} catch (error) {
  console.error("[Firebase] Initialization failed during setup:", error);
}

// Helper functions for data sync
const USER_ID = "default_user_v1";

const notifySyncStatus = (status: 'saving' | 'saved' | 'error') => {
  const event = new CustomEvent('sync-status', { detail: status });
  window.dispatchEvent(event);
};

export const syncDataToCloud = async (collectionName: string, data: any) => {
  if (!isFirebaseInitialized || !db) {
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