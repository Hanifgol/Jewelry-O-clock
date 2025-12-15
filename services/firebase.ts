import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwmOv_Iy1rK1dqYggE63dkI7Fx1Y578b0",
  authDomain: "jewelry-o-clock.firebaseapp.com",
  projectId: "jewelry-o-clock",
  storageBucket: "jewelry-o-clock.firebasestorage.app",
  messagingSenderId: "927986593994",
  appId: "1:927986593994:web:e20dcf52174bd082f6c433",
  measurementId: "G-JHWMGQXTF7"
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | undefined;

// Initialize App
if (getApps().length > 0) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

// Initialize Firestore with settings
// We attempt to initialize with long polling to fix connection issues.
// If Firestore was already initialized (e.g. by another import or HMR), this throws,
// so we fall back to the existing instance.
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch (e) {
  // Fallback if already initialized
  db = getFirestore(app);
}

// Initialize Auth
auth = getAuth(app);

// Initialize Analytics safely
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Firebase Analytics failed to initialize", e);
  }
}

export { auth, db, analytics };
export default app;