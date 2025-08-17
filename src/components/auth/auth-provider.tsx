"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, ADMIN_UID } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      // In a real app, you'd have a more robust way of checking admin status,
      // like a custom claim or a database lookup. For this demo, we'll use a
      // hardcoded UID in an environment variable.
      setIsAdmin(user?.uid === ADMIN_UID);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
