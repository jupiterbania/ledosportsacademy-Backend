
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Club, LayoutDashboard, HandCoins, Medal, Users as UsersIcon, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { getAllNotifications, Notification } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';


function NotificationContent({ notifications }: { notifications: Notification[] }) {
    return (
        <>
            <div className="p-4">
              <h4 className="font-medium text-sm">Notifications</h4>
            </div>
            <ScrollArea className="h-[300px]">
                {notifications.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">No new notifications</p>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map(notif => (
                            <Link key={notif.id} href={notif.link || '#'} className="block hover:bg-accent" passHref>
                                <div className="p-4 border-b">
                                    <p className="font-semibold text-sm">{notif.title}</p>
                                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {notif.createdAt ? formatDistanceToNow(new Date((notif.createdAt as any).seconds * 1000), { addSuffix: true }) : ''}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </ScrollArea>
            <div className="p-2 border-t text-center">
                <Button variant="link" size="sm" asChild>
                   <Link href="#">View all notifications</Link>
                </Button>
            </div>
        </>
    )
}

function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchNotifications = async () => {
            const fetchedNotifications = await getAllNotifications();
            setNotifications(fetchedNotifications);
            setHasUnread(fetchedNotifications.length > 0); 
        }
        fetchNotifications();
    }, []);

    const triggerButton = (
        <Button variant="ghost" size="icon" className="relative">
            {hasUnread && <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />}
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
        </Button>
    );

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    {triggerButton}
                </SheetTrigger>
                <SheetContent className="w-[300px] p-0" side="right">
                    <NotificationContent notifications={notifications} />
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {triggerButton}
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <NotificationContent notifications={notifications} />
            </PopoverContent>
        </Popover>
    )
}

export function Header() {
  const router = useRouter();
  const { user, isAdmin, isRegisteredMember } = useAuth();

  const handleLogout = async () => {
    await signOut();
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
      className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary hover:drop-shadow-[0_0_8px_hsl(var(--primary))]"
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/5 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 mr-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                <Image src="https://iili.io/KFLBPv1.png" alt="LEDO SPORTS ACADEMY Logo" width={32} height={32} />
              </button>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-0 shadow-none max-w-xs">
              <Image src="https://iili.io/KFLBPv1.png" alt="LEDO SPORTS ACADEMY Logo" width={400} height={400} className="rounded-lg w-full h-auto" />
            </DialogContent>
          </Dialog>
           <Link href="/" className="flex items-center gap-2">
              <span className="font-bold sm:hidden text-xl">LSA</span>
              <span className="font-bold hidden sm:inline sm:text-xl">LEDO SPORTS ACADEMY</span>
           </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 flex-grow">
          {baseNavLinks.map((link) => <NavLink key={link.href} {...link} />)}
          {user && !isAdmin && isRegisteredMember && memberNavLinks.map((link) => <NavLink key={link.href} {...link} />)}
          {isAdmin && <NavLink href="/admin" label="Admin Dashboard" />}
        </nav>
        
        <div className="hidden md:flex items-center ml-auto gap-2">
           <NotificationBell />
          {user ? (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                             <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                             <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 aurora-card" align="end" forceMount>
                     <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     {!isAdmin && isRegisteredMember && (
                         <DropdownMenuItem onClick={() => router.push('/member/profile')}>
                             My Profile
                         </DropdownMenuItem>
                     )}
                     {isAdmin && (
                         <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                             Settings
                         </DropdownMenuItem>
                     )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button onClick={() => router.push('/login')} variant="outline" className="aurora-card hover:aurora-glow">Login</Button>
          )}
        </div>


        <div className="md:hidden ml-auto flex items-center gap-2">
          <NotificationBell />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
               <SheetHeader>
                 <SheetTitle>Main Menu</SheetTitle>
                 <SheetDescription className="sr-only">A list of navigation links for the site.</SheetDescription>
               </SheetHeader>
               <div className="p-4">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2 mb-6">
                     <Image src="https://iili.io/KFLBPv1.png" alt="LEDO SPORTS ACADEMY Logo" width={32} height={32} />
                    <span className="font-bold text-xl">LEDO SPORTS ACADEMY</span>
                  </Link>
                </SheetClose>

                {user && (
                     <div className="flex items-center gap-3 mb-4">
                        <Avatar>
                           <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                             <p className="text-sm font-medium leading-none">{user.displayName}</p>
                             <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                     </div>
                )}


                <nav className="flex flex-col gap-3">
                  {baseNavLinks.map((link) => <MobileNavLink key={link.href} {...link} />)}
                   {user && !isAdmin && isRegisteredMember && memberNavLinks.map((link) => <MobileNavLink key={link.href} {...link} />)}
                  {isAdmin && <MobileNavLink href="/admin" label="Admin Dashboard" />}
                  <Separator className="my-3" />
                   {user && !isAdmin && isRegisteredMember && (
                       <MobileNavLink href="/member/profile" label="My Profile" />
                   )}
                  <SheetClose asChild>
                    <Button onClick={() => user ? handleLogout() : router.push('/login')} className="w-full">
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
