
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login');
      } else if (!isAdmin && pathname !== '/admin/login') {
         router.push('/admin/login'); // Redirect non-admins to login
      }
    }
  }, [user, loading, isAdmin, router, pathname]);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  if (loading || !user || !isAdmin) {
      if (pathname === '/admin/login') {
          return <>{children}</>;
      }
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading or Access Denied...</div>
      </div>
    );
  }
   if (pathname === '/admin/login') {
      return <>{children}</>;
  }

  const baseMenuItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/gallery', label: 'Gallery' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/achievements', label: 'Achievements' },
    { href: '/admin/members', label: 'Members' },
    { href: '/admin/finances', label: 'Finances' },
    { href: '/admin/notifications', label: 'Notifications' },
    { href: '/admin/export', label: 'PDF Export' },
  ];

  const superAdminMenuItems = [
     { href: '/admin/requests', label: 'Admin Requests' },
  ];

  const menuItems = isSuperAdmin ? [...baseMenuItems, ...superAdminMenuItems] : baseMenuItems;


  const NavLink = ({ href, label, isActive }: { href: string; label: string; isActive: boolean; }) => (
    <SidebarMenuItem>
      <Link href={href} passHref>
        <SidebarMenuButton tooltip={label} isActive={isActive} size="lg" className="justify-center md:justify-start">
          <span className="md:inline hidden">{label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );

  const DesktopNav = () => (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-white/10 bg-black/10 backdrop-blur-lg hidden md:flex">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-semibold">
           <Image src="https://iili.io/KFLBPv1.png" alt="LEDO SPORTS ACADEMY Logo" width={40} height={40} />
           <span className="text-lg hidden group-data-[collapsible=icon]:hidden">LEDO SPORTS ACADEMY</span>
        </Link>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu>
          {menuItems.map((item) => (
            <NavLink key={item.href} {...item} isActive={pathname === item.href} />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );

  return (
    <div className="flex h-screen w-full">
      <DesktopNav />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-white/10 bg-black/10 backdrop-blur-lg px-4 lg:px-6 shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="https://iili.io/KFLBPv1.png" alt="LEDO SPORTS ACADEMY Logo" width={28} height={28} />
                    <span>LEDO SPORTS ACADEMY</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex-1 overflow-y-auto grid gap-2 text-lg font-medium mt-4">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    {item.label}
                  </Link>
                ))}
                 <Link href="/admin/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    Profile
                  </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Admin'} />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="aurora-card">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/admin/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayout>{children}</AdminLayout>
    </SidebarProvider>
  )
}
