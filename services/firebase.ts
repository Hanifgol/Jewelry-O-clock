import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore, initializeFirestore } from "firebase/firestore";

// Defensively definition for environment variables or fallbacks
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

try {
  // Initialize App
  // Check if config appears valid to prevent immediate crash on empty strings
  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase API Key is missing");
  }

  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }

  // Initialize Firestore with settings
  // We attempt to initialize with long polling to fix connection issues.
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

  // Initialize Analytics safely (client-side only)
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Firebase Analytics failed to initialize (non-fatal)", e);
    }
  }

  console.log("Firebase initialized successfully");

} catch (error) {
  console.error("Firebase Initialization Critical Failure:", error);
  // We do NOT re-throw here. We allow the app to load so it doesn't white-screen.
  // The services consuming 'db' or 'auth' must check if they are defined.
}

export { auth, db, analytics };
export default app;