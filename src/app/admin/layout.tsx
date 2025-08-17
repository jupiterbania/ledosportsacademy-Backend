"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  GalleryHorizontal,
  Calendar,
  Users,
  HandCoins,
  Medal,
  LineChart,
  FileDown,
  LogOut,
  Settings,
  Club,
} from 'lucide-react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const menuItems = [
    { href: '/admin', label: 'Home', icon: Home },
    { href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/members', label: 'Members', icon: Users },
    { href: '/admin/finances', label: 'Finances', icon: HandCoins },
    { href: '/admin/experience', label: 'Experience', icon: Medal },
    { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
    { href: '/admin/export', label: 'PDF Export', icon: FileDown },
  ];

  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarHeader>
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => toggleSidebar()}>
                  <SidebarTrigger />
                </Button>
                <Club className="w-6 h-6 text-primary" />
                <h1 className="text-lg font-semibold">Club Central</h1>
             </div>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <item.icon/>
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => toggleSidebar()}>
             <SidebarTrigger />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Welcome, Admin!</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Admin'} />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <SidebarInset>{children}</SidebarInset>
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
