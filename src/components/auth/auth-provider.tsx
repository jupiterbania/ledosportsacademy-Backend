
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, ADMIN_EMAIL } from '@/lib/auth';
import { checkIfMemberExists } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isRegisteredMember: boolean | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isRegisteredMember: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegisteredMember, setIsRegisteredMember] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      const adminStatus = user?.email === ADMIN_EMAIL;
      setIsAdmin(adminStatus);
      
      if (user && !adminStatus) {
        const memberExists = await checkIfMemberExists(user.email!);
        setIsRegisteredMember(memberExists);
        if (!memberExists && pathname !== '/register') {
            router.push('/register');
        }
      } else {
        setIsRegisteredMember(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isRegisteredMember }}>
      {children}
    </AuthContext.Provider>
  );
};
