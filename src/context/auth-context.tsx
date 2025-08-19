
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { LoadingSpinner } from '@/components/loading-spinner';
import type { UserProfile } from '@/lib/types';


interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const timer = setTimeout(() => {
      if (loading) {
        setShowLoader(true);
      }
    }, 500); // Only show loader if auth takes more than 500ms

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
      setShowLoader(false); 
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [hasMounted, loading]);

  if (!hasMounted) {
    return null;
  }
  
  if (showLoader) {
    return <LoadingSpinner />;
  }
  
  // Render children immediately if loading is finished, to avoid blank screen
  if (loading) {
    return null; // Render nothing initially, wait for loader logic
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
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
