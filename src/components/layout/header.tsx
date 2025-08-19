
"use client"

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Club, LayoutDashboard, HandCoins, Medal, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';


export function Header() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    }
    router.push('/login');
  };
  
  const baseNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/events', label: 'Events' },
  ];
  
  const memberNavLinks = [
    { href: '/member/members', label: 'Members', icon: UsersIcon },
    { href: '/member/finances', label: 'Finances', icon: HandCoins },
    { href: '/member/achievements', label: 'Achievements', icon: Medal },
  ];

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
        <Link href="/" className="flex items-center gap-2 mr-4">
          <Image src="https://iili.io/Fijeoxf.png" alt="LEDO SPORTS ACADEMY Logo" width={32} height={32} />
          <span className="font-bold sm:text-xl">LEDO SPORTS ACADEMY</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 flex-grow">
          {baseNavLinks.map((link) => <NavLink key={link.href} {...link} />)}
          {user && !isAdmin && memberNavLinks.map((link) => <NavLink key={link.href} {...link} />)}
          {isAdmin && <NavLink href="/admin" label="Admin Dashboard" />}
        </nav>
        
        <div className="hidden md:flex items-center ml-auto gap-2">
            <ThemeToggle />
          {user ? (
             <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Hello, {user.displayName?.split(' ')[0]}!</span>
                <Button onClick={handleAuthAction}>Logout</Button>
            </div>
          ) : (
             <Button onClick={handleAuthAction}>Login</Button>
          )}
        </div>


        <div className="md:hidden ml-auto flex items-center gap-2">
           <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
               <SheetHeader>
                 <SheetTitle className="sr-only">Main Menu</SheetTitle>
                 <SheetDescription className="sr-only">A list of navigation links for the site.</SheetDescription>
               </SheetHeader>
               <div className="p-4">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2 mb-6">
                     <Image src="https://iili.io/Fijeoxf.png" alt="LEDO SPORTS ACADEMY Logo" width={32} height={32} />
                    <span className="font-bold text-xl">LEDO SPORTS ACADEMY</span>
                  </Link>
                </SheetClose>
                <nav className="flex flex-col gap-3">
                  {baseNavLinks.map((link) => <MobileNavLink key={link.href} {...link} />)}
                   {user && !isAdmin && memberNavLinks.map((link) => <MobileNavLink key={link.href} {...link} />)}
                  {isAdmin && <MobileNavLink href="/admin" label="Admin Dashboard" />}
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
