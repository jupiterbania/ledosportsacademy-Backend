
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, ADMIN_EMAIL } from '@/lib/auth';
import { checkIfMemberExists, getMemberByEmail, Member } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isRegisteredMember: boolean | null;
  member: Member | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  isRegisteredMember: null,
  member: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isRegisteredMember, setIsRegisteredMember] = useState<boolean | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      
      if (user) {
        const superAdminStatus = user.email === ADMIN_EMAIL;
        setIsSuperAdmin(superAdminStatus);

        const memberData = await getMemberByEmail(user.email!);
        setMember(memberData);
        
        const adminStatus = superAdminStatus || memberData?.isAdmin === true;
        setIsAdmin(adminStatus);
        
        const memberExists = !!memberData;
        setIsRegisteredMember(memberExists);

        if (!memberExists && pathname !== '/register' && pathname !== '/admin-request') {
          router.push('/register');
        }
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setIsRegisteredMember(null);
        setMember(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isSuperAdmin, isRegisteredMember, member }}>
      {children}
    </AuthContext.Provider>
  );
};
