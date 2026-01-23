
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

export type SyncStatus = 'saving' | 'saved' | 'offline' | 'online' | 'error';

export const notifySyncStatus = (status: SyncStatus) => {
  const event = new CustomEvent('sync-status', { detail: status });
  window.dispatchEvent(event);
};

// Monitor de internet robusto
window.addEventListener('online', () => {
  console.log("Conectado! Sincronizando dados...");
  notifySyncStatus('online');
  // Dispara evento global para componentes re-sincronizarem imediatamente
  window.dispatchEvent(new CustomEvent('app-back-online'));
});

window.addEventListener('offline', () => {
  console.log("Sem internet. Operando em modo Local.");
  notifySyncStatus('offline');
});

export const syncDataToCloud = async (collectionName: string, data: any) => {
  // Se estiver offline, avisa o sistema
  if (!navigator.onLine) {
    notifySyncStatus('offline');
    return;
  }

  // Se o Firebase não estiver pronto, não tenta sincronizar
  if (!isFirebaseInitialized || !db) {
    return;
  }

  try {
    notifySyncStatus('saving');
    await setDoc(doc(db, collectionName, USER_ID), {
      ...data,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    
    // Após salvar com sucesso, volta para o estado online/protegido
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
