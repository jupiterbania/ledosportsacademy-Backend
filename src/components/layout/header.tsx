"use client"

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Club } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/auth';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/events', label: 'Events' },
];

export function Header() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    }
    router.push('/login');
  };
  
  const NavLink = ({ href, label }: { href: string, label: string }) => (
    <Link 
      href={href} 
      className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
    >
      {label}
    </Link>
  );

  const MobileNavLink = ({ href, label }: { href: string, label: string }) => (
    <SheetClose asChild>
      <Link href={href} className="block px-2 py-2 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
        {label}
      </Link>
    </SheetClose>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Club className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl">Club Central</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 flex-grow">
          {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
          {user && <NavLink href="/admin" label="Admin Dashboard" />}
        </nav>

        <div className="hidden md:flex items-center">
            <Button onClick={handleAuthAction}>
                {user ? 'Logout' : 'Login'}
            </Button>
        </div>

        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
               <div className="p-4">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2 mb-6">
                    <Club className="h-7 w-7 text-primary" />
                    <span className="font-bold text-xl">Club Central</span>
                  </Link>
                </SheetClose>
                <nav className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <MobileNavLink key={link.href} {...link} />
                  ))}
                  {user && <MobileNavLink href="/admin" label="Admin Dashboard" />}
                  <Separator className="my-3" />
                  <SheetClose asChild>
                    <Button onClick={handleAuthAction} className="w-full">
                      {user ? 'Logout' : 'Login'}
                    </Button>
                  </SheetClose>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
