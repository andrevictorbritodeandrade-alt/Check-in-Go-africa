
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseInitialized = false;

const isValidConfig = (config: any) => {
  return config.apiKey && config.apiKey !== "undefined" && config.projectId;
};

if (isValidConfig(firebaseConfig)) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseInitialized = true;
  } catch (error) {
    console.error("[Firebase] Fail:", error);
  }
}

const USER_ID = "andre_marcelly_sa_2026";

export const notifySyncStatus = (status: 'saving' | 'saved' | 'offline' | 'error') => {
  const event = new CustomEvent('sync-status', { detail: status });
  window.dispatchEvent(event);
};

// Monitor de internet para re-sincronização
window.addEventListener('online', () => {
  console.log("Internet de volta! Sincronizando dados pendentes...");
  notifySyncStatus('saving');
  // Dispara evento global para componentes re-sincronizarem
  window.dispatchEvent(new CustomEvent('app-back-online'));
});

window.addEventListener('offline', () => {
  notifySyncStatus('offline');
});

export const syncDataToCloud = async (collectionName: string, data: any) => {
  if (!isFirebaseInitialized || !db || !navigator.onLine) {
    console.debug(`[Local Only] Gravado no celular: ${collectionName}`);
    notifySyncStatus('offline');
    return;
  }

  try {
    notifySyncStatus('saving');
    await setDoc(doc(db, collectionName, USER_ID), {
      ...data,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    
    notifySyncStatus('saved');
  } catch (e) {
    console.error(`[Firebase] Sync Error:`, e);
    notifySyncStatus('error');
  }
};

export const loadDataFromCloud = async (collectionName: string) => {
  if (!isFirebaseInitialized || !db || !navigator.onLine) return null;
  try {
    const docSnap = await getDoc(doc(db, collectionName, USER_ID));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    return null;
  }
};

export { db, auth };
