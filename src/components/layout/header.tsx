
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { ThemeToggle } from '../theme-toggle';


function NotificationContent({ notifications, onLinkClick }: { notifications: Notification[], onLinkClick: () => void }) {
    const router = useRouter();

    const handleNotificationClick = (link: string | undefined) => {
        onLinkClick();
        if (link) {
            router.push(link);
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <h4 className="font-medium text-sm">Notifications</h4>
            </div>
            <ScrollArea className="flex-1">
                {notifications.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">No new notifications</p>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map(notif => (
                           <div key={notif.id} onClick={() => handleNotificationClick(notif.link)} className="block hover:bg-accent cursor-pointer">
                                <div className="p-4 border-b">
                                     {notif.imageUrl && (
                                        <div className="relative aspect-video w-full rounded-md overflow-hidden mb-2">
                                             <Image src={notif.imageUrl} alt={notif.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 384px"/>
                                        </div>
                                    )}
                                    <p className="font-semibold text-sm">{notif.title}</p>
                                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {notif.createdAt ? formatDistanceToNow(new Date((notif.createdAt as any).seconds * 1000), { addSuffix: true }) : ''}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}

function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchNotifications = async () => {
            const fetchedNotifications = await getAllNotifications();
            setNotifications(fetchedNotifications);
            if (fetchedNotifications.length > 0) {
              const latestTimestamp = new Date((fetchedNotifications[0].createdAt as any).seconds * 1000).getTime();
              const lastSeenTimestamp = localStorage.getItem('lastSeenNotificationTimestamp');
              if (!lastSeenTimestamp || latestTimestamp > parseInt(lastSeenTimestamp, 10)) {
                setHasUnread(true);
              }
            }
        }
        fetchNotifications();
    }, []);

    const handleOpenChange = (open: boolean) => {
        setIsPopoverOpen(open);
        if (open && hasUnread) {
            setHasUnread(false);
            if (notifications.length > 0) {
                 const latestTimestamp = new Date((notifications[0].createdAt as any).seconds * 1000).getTime();
                 localStorage.setItem('lastSeenNotificationTimestamp', latestTimestamp.toString());
            }
        }
    };

    const handleLinkClick = () => {
        setIsPopoverOpen(false);
    };

    const triggerButton = (
        <Button variant="ghost" size="icon" className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            {hasUnread && <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />}
            <span className="sr-only">Notifications</span>
        </Button>
    );

    if (isMobile) {
        return (
            <Sheet open={isPopoverOpen} onOpenChange={handleOpenChange}>
                <SheetTrigger asChild>
                    {triggerButton}
                </SheetTrigger>
                <SheetContent className="w-[85vw] max-w-sm p-0 flex flex-col h-full" side="right">
                    <NotificationContent notifications={notifications} onLinkClick={handleLinkClick} />
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                {triggerButton}
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 aurora-card" align="end">
                <NotificationContent notifications={notifications} onLinkClick={handleLinkClick}/>
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
    { href: '/member/members', label: 'Members' },
    { href: '/member/finances', label: 'Finances' },
    { href: '/member/achievements', label: 'Achievements' },
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
              <DialogTitle className="sr-only">LEDO SPORTS ACADEMY Logo</DialogTitle>
              <Image src="https://iili.io/KFLBPv1.png" alt="LEDO SPORTS ACADEMY Logo" width={400} height={400} className="rounded-lg w-full h-auto" sizes="100vw"/>
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
          <ThemeToggle />
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
                     {isRegisteredMember && (
                         <DropdownMenuItem onClick={() => router.push(isAdmin ? '/admin/profile' : '/member/profile')}>
                             My Profile
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
          <ThemeToggle />
          <NotificationBell />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
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
                   {user && isRegisteredMember && (
                       <MobileNavLink href={isAdmin ? '/admin/profile' : '/member/profile'} label="My Profile" />
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
