
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
  Settings,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
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
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/'); // Redirect non-admins to home page
      }
    }
  }, [user, loading, isAdmin, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading or Access Denied...</div>
      </div>
    );
  }

  const baseMenuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
    { href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/achievements', label: 'Achievements', icon: Medal },
    { href: '/admin/members', label: 'Members', icon: Users },
    { href: '/admin/finances', label: 'Finances', icon: HandCoins },
    { href: '/admin/export', label: 'PDF Export', icon: FileDown },
  ];

  const superAdminMenuItems = [
     { href: '/admin/requests', label: 'Admin Requests', icon: ShieldCheck },
     { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = isSuperAdmin ? [...baseMenuItems, ...superAdminMenuItems] : baseMenuItems;


  const NavLink = ({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: React.ElementType; isActive: boolean; }) => (
    <SidebarMenuItem>
      <Link href={href} passHref>
        <SidebarMenuButton tooltip={label} isActive={isActive} size="lg" className="justify-center md:justify-start">
          <Icon />
          <span className="md:inline hidden">{label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );

  const DesktopNav = () => (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-white/10 bg-black/10 backdrop-blur-lg">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-semibold">
           <Image src="https://iili.io/FpDNveV.png" alt="LEDO SPORTS ACADEMY Logo" width={32} height={32} />
           <span className="text-lg hidden group-data-[collapsible=icon]:hidden">LEDO SPORTS ACADEMY</span>
        </Link>
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
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="https://iili.io/FpDNveV.png" alt="LEDO SPORTS ACADEMY Logo" width={24} height={24} />
                    <span>LEDO SPORTS ACADEMY</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex-1 overflow-y-auto grid gap-2 text-lg font-medium mt-4">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
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
              <DropdownMenuItem onClick={() => router.push('/admin/settings')}>Settings</DropdownMenuItem>
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
