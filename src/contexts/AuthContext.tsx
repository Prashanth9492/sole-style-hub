import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '@/lib/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Sync Firebase user with MongoDB backend
async function syncFirebaseUser(firebaseUser: User): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/firebase-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        phone: firebaseUser.phoneNumber || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to sync user');
    }

    const data = await response.json();
    // Store the JWT token for API requests
    localStorage.setItem('authToken', data.token);
  } catch (error) {
    console.error('Error syncing Firebase user with backend:', error);
    throw error;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await syncFirebaseUser(firebaseUser);
          setUser(firebaseUser);
        } catch (error) {
          console.error('Failed to sync user:', error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithApple = async () => {
    await signInWithPopup(auth, appleProvider);
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
