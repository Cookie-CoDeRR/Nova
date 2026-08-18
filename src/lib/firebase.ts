import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD6RcjmmQ86P-zdOpuTzkDRyihCFSz4vys",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nova-e54dc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nova-e54dc",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nova-e54dc.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "126382247525",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:126382247525:web:4134e72513722778fcc08c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-1XEFRKBPW2",
};

// Get or create the Firebase app singleton
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Get the Auth instance with proper persistence + popup/redirect resolver.
 * Using initializeAuth instead of getAuth prevents the Firebase SDK regression
 * where the visibilitychange event fires during a popup and closes IndexedDB,
 * causing the "Database is closing/hidden" error.
 *
 * We wrap in try/catch because initializeAuth throws if called more than once
 * on the same app (e.g. Next.js HMR), in which case we fall back to getAuth.
 */
function getOrInitAuth(firebaseApp: FirebaseApp): Auth {
  try {
    return initializeAuth(firebaseApp, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    // Auth already initialized for this app instance (e.g. HMR / hot reload)
    return getAuth(firebaseApp);
  }
}

export const auth = getOrInitAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

export default app;
