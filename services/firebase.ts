
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  // Use process.env.API_KEY exclusively
  apiKey: process.env.API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
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
    console.log("[Firebase] Inicializado com sucesso.");
  } catch (error) {
    console.error("[Firebase] Falha na inicialização:", error);
  }
} else {
  console.warn("[Firebase] Configurações ausentes. Sincronização em nuvem desativada.");
}

const USER_ID = "andre_marcelly_sa_2026";

export type SyncStatus = 'saving' | 'saved' | 'offline' | 'online' | 'error';

export const notifySyncStatus = (status: SyncStatus) => {
  const event = new CustomEvent('sync-status', { detail: status });
  window.dispatchEvent(event);
};

window.addEventListener('online', () => {
  notifySyncStatus('online');
  window.dispatchEvent(new CustomEvent('app-back-online'));
});

window.addEventListener('offline', () => {
  notifySyncStatus('offline');
});

export const syncDataToCloud = async (collectionName: string, data: any) => {
  if (!navigator.onLine || !isFirebaseInitialized || !db) {
    return;
  }

  try {
    notifySyncStatus('saving');
    await setDoc(doc(db, collectionName, USER_ID), {
      ...data,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    notifySyncStatus('saved');
    console.log(`[Firebase] Dados sincronizados em: ${collectionName}`);
  } catch (e) {
    console.error(`[Firebase] Erro ao salvar ${collectionName}:`, e);
    notifySyncStatus('error');
  }
};

// Explicitly return any to avoid 'unknown' type issues in consumers
export const loadDataFromCloud = async (collectionName: string): Promise<any> => {
  if (!isFirebaseInitialized || !db || !navigator.onLine) {
    console.warn(`[Firebase] Não é possível carregar ${collectionName} agora (Offline ou Não Inicializado).`);
    return null;
  }
  try {
    const docSnap = await getDoc(doc(db, collectionName, USER_ID));
    if (docSnap.exists()) {
      console.log(`[Firebase] Dados carregados de: ${collectionName}`);
      return docSnap.data();
    }
    return null;
  } catch (e) {
    console.error(`[Firebase] Erro ao carregar ${collectionName}:`, e);
    return null;
  }
};

export { db, auth };
