
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
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Image from 'next/image';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
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

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
  ];

  const contentManagementItems = [
    { href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/achievements', label: 'Achievements', icon: Medal },
  ]

  const userManagementItems = [
     { href: '/admin/members', label: 'Members', icon: Users },
  ];

  const financialManagementItems = [
    { href: '/admin/finances', label: 'Finances', icon: HandCoins },
  ];
  
  const dataManagementItems = [
    { href: '/admin/export', label: 'PDF Export', icon: FileDown },
  ];

  const settingsItems = [
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]
  

  const NavLink = ({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: React.ElementType; isActive: boolean; }) => (
     <Link href={href} passHref>
      <SidebarMenuButton asChild isActive={isActive}>
        <span>
          <Icon />
          {label}
        </span>
      </SidebarMenuButton>
    </Link>
  )

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image src="https://iili.io/Fijeoxf.png" alt="LEDO SPORTS ACADEMY Logo" width={24} height={24} />
              <span className="">LEDO SPORTS ACADEMY</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <NavLink {...item} isActive={pathname === item.href} />
                    </SidebarMenuItem>
                  ))}

                <Collapsible className="w-full">
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton className="w-full justify-start gap-2">
                      <GalleryHorizontal />
                      Content
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {contentManagementItems.map((item) => (
                        <SidebarMenuSubButton key={item.href} asChild isActive={pathname === item.href}>
                          <Link href={item.href}>{item.label}</Link>
                        </SidebarMenuSubButton>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton className="w-full justify-start gap-2">
                      <Users />
                      Users
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {userManagementItems.map((item) => (
                        <SidebarMenuSubButton key={item.href} asChild isActive={pathname === item.href}>
                          <Link href={item.href}>{item.label}</Link>
                        </SidebarMenuSubButton>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton className="w-full justify-start gap-2">
                      <HandCoins />
                      Financial
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {financialManagementItems.map((item) => (
                        <SidebarMenuSubButton key={item.href} asChild isActive={pathname === item.href}>
                          <Link href={item.href}>{item.label}</Link>
                        </SidebarMenuSubButton>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible className="w-full">
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton className="w-full justify-start gap-2">
                      <FileDown />
                      Data
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {dataManagementItems.map((item) => (
                        <SidebarMenuSubButton key={item.href} asChild isActive={pathname === item.href}>
                          <Link href={item.href}>{item.label}</Link>
                        </SidebarMenuSubButton>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible className="w-full">
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton className="w-full justify-start gap-2">
                      <Settings />
                      General
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {settingsItems.map((item) => (
                        <SidebarMenuSubButton key={item.href} asChild isActive={pathname === item.href}>
                          <Link href={item.href}>{item.label}</Link>
                        </SidebarMenuSubButton>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenu>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           <div className="w-full flex-1">
             {/* Mobile Nav Trigger can go here if needed */}
          </div>
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/admin/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col p-4 sm:p-6 overflow-auto">
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
