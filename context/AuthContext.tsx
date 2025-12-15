import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  googleSignIn: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Map Firebase User to App User
  const mapUser = (fbUser: FirebaseUser): User => {
    // Basic role logic: In a real app, this would come from Firestore or Custom Claims.
    // For this demo, we check a hardcoded admin email.
    const role: UserRole = fbUser.email === 'admin@jewelryoclock.com' ? 'admin' : 'customer';
    
    return {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      email: fbUser.email || '',
      role: role
    };
  };

  useEffect(() => {
    // CRITICAL FIX: Ensure auth exists before using it.
    // If services/firebase.ts failed to init (e.g. network error), 'auth' will be undefined.
    if (!auth) {
      console.warn("Auth service is not available. Running in offline/guest mode.");
      setLoading(false);
      return;
    }

    // Handle redirect result (if coming back from signInWithRedirect)
    getRedirectResult(auth).catch((error) => {
       console.error("Redirect sign-in error", error);
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapUser(firebaseUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) return { success: false, error: "Auth service unavailable" };
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Login error", error);
      const message = error.message.replace('Firebase: ', '').replace('auth/', '');
      return { success: false, error: message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (!auth) return { success: false, error: "Auth service unavailable" };
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      setUser(mapUser({ ...userCredential.user, displayName: name } as FirebaseUser));
      return { success: true };
    } catch (error: any) {
      console.error("Register error", error);
      const message = error.message.replace('Firebase: ', '').replace('auth/', '');
      return { success: false, error: message };
    }
  };

  const googleSignIn = async () => {
    if (!auth) return { success: false, error: "Auth service unavailable" };
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error: any) {
      let message = error.message;

      if (error.code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
        const domain = window.location.hostname;
        message = `Domain Error: The current domain (${domain}) is not authorized for Google Sign-In.\n\nTo fix this, go to the Firebase Console > Authentication > Settings > Authorized Domains and add "${domain}".`;
        console.warn(message);
        return { success: false, error: message };
      }

      console.error("Google Sign In error", error);

      if (error.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, provider);
          return { success: true };
        } catch (redirectError: any) {
          console.error("Redirect error", redirectError);
          return { success: false, error: "Unable to sign in via popup or redirect." };
        }
      }

      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Sign in was cancelled.';
      } else {
        message = message.replace('Firebase: ', '').replace('auth/', '');
      }

      return { success: false, error: message };
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      googleSignIn,
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};