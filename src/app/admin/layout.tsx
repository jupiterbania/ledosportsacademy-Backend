
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
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
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
import { LayoutDashboard, BarChart3, GalleryHorizontal, CalendarDays, Trophy, Users, CircleDollarSign, Bell, FileDown, UserCheck, Menu, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';


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

  const overviewMenuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const contentMenuItems = [
    { href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
    { href: '/admin/events', label: 'Events', icon: CalendarDays },
    { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  ];

  const managementMenuItems = [
    { href: '/admin/members', label: 'Members', icon: Users },
    { href: '/admin/finances', label: 'Finances', icon: CircleDollarSign },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  ];
  
  const toolsMenuItems = [
     { href: '/admin/export', label: 'PDF Export', icon: FileDown },
  ]

  const superAdminMenuItems = [
     { href: '/admin/requests', label: 'Admin Requests', icon: UserCheck },
  ];


  const NavLink = ({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: React.ElementType, isActive: boolean; }) => (
    <SidebarMenuItem>
      <Link href={href} passHref>
        <SidebarMenuButton tooltip={label} isActive={isActive} size="lg" className="justify-center md:justify-start">
          <Icon className="size-5" />
          <span className="md:inline hidden">{label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );

  const DesktopNav = () => (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-white/10 bg-black/10 backdrop-blur-lg hidden md:flex">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-semibold">
           <Image src="https://iili.io/KFLBPv1.png" alt="Admin Logo" width={40} height={40} />
           <span className="text-lg hidden group-data-[collapsible=icon]:hidden">Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
             {overviewMenuItems.map((item) => (
                <NavLink key={item.href} {...item} isActive={pathname === item.href} />
             ))}
          </SidebarGroup>

          <SidebarSeparator />
          
          <SidebarGroup>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
             {contentMenuItems.map((item) => (
                <NavLink key={item.href} {...item} isActive={pathname === item.href} />
             ))}
          </SidebarGroup>

          <SidebarSeparator />

           <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
             {managementMenuItems.map((item) => (
                <NavLink key={item.href} {...item} isActive={pathname === item.href} />
             ))}
              {isSuperAdmin && superAdminMenuItems.map((item) => (
                <NavLink key={item.href} {...item} isActive={pathname === item.href} />
             ))}
          </SidebarGroup>
          
           <SidebarSeparator />
           
           <SidebarGroup>
             <SidebarGroupLabel>Tools</SidebarGroupLabel>
              {toolsMenuItems.map((item) => (
                <NavLink key={item.href} {...item} isActive={pathname === item.href} />
              ))}
           </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
  
  const allMenuItems = [...overviewMenuItems, ...contentMenuItems, ...managementMenuItems, ...(isSuperAdmin ? superAdminMenuItems : []), ...toolsMenuItems];

  return (
    <div className="flex h-screen w-full">
      <DesktopNav />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-white/10 bg-black/10 backdrop-blur-lg px-4 lg:px-6 shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                 <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="https://iili.io/KFLBPv1.png" alt="Admin Logo" width={28} height={28} />
                    <span>Admin</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex-1 overflow-y-auto grid gap-2 text-lg font-medium mt-4">
                {allMenuItems.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <item.icon className="h-5 w-5"/>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
           <ThemeToggle />
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
              <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
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
