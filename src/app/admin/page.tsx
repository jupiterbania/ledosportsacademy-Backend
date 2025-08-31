
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getAllDonations, Donation, 
  getAllCollections, Collection,
  getAllExpenses, Expense,
  getAllMembers, Member,
  getAllPhotos, Photo,
  getAllEvents, Event,
  getAllAchievements, Achievement
} from "@/lib/data";
import { useMemo, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Users, CalendarDays, CircleDollarSign, Trophy, GalleryHorizontal, ArrowUpRight, ArrowDownRight, Scale, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";


export default function AdminDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donationsData, collectionsData, expensesData, membersData, photosData, eventsData, achievementsData] = await Promise.all([
        getAllDonations(),
        getAllCollections(),
        getAllExpenses(),
        getAllMembers(),
        getAllPhotos(),
        getAllEvents(),
        getAllAchievements(),
      ]);
      setDonations(donationsData);
      setCollections(collectionsData);
      setExpenses(expensesData);
      setMembers(membersData);
      setPhotos(photosData);
      setEvents(eventsData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ title: "Error", description: "Failed to load dashboard data.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sliderPhotos = useMemo(() => photos.filter(p => p.isSliderPhoto), [photos]);
  const sliderEvents = useMemo(() => events.filter(e => e.showOnSlider), [events]);
  const recentPhotos = useMemo(() => photos.slice(0, 5), [photos]);
  const recentEvents = useMemo(() => events.slice(0, 5), [events]);

  const totalDonations = useMemo(() => donations.reduce((sum, d) => sum + (d.amount || 0), 0), [donations]);
  const totalCollections = useMemo(() => collections.reduce((sum, c) => sum + c.amount, 0), [collections]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  
  const summaryCards = [
    { href: "/admin/members", title: "Total Members", value: members.length, icon: Users },
    { href: "/admin/gallery", title: "Total Photos", value: photos.length, icon: GalleryHorizontal },
    { href: "/admin/events", title: "Total Events", value: events.length, icon: CalendarDays },
    { href: "/admin/achievements", title: "Total Achievements", value: achievements.length, icon: Trophy },
  ];
  
   const financeCards = [
    { href: "/admin/finances", title: "Total Donations", value: `Rs ${new Intl.NumberFormat('en-IN').format(totalDonations)}`, icon: ArrowUpRight, color: "text-green-500" },
    { href: "/admin/finances", title: "Total Collections", value: `Rs ${new Intl.NumberFormat('en-IN').format(totalCollections)}`, icon: ArrowUpRight, color: "text-green-500" },
    { href: "/admin/finances", title: "Total Expenses", value: `Rs ${new Intl.NumberFormat('en-IN').format(totalExpenses)}`, icon: ArrowDownRight, color: "text-red-500" },
    { href: "/admin/finances", title: "Net Balance", value: `Rs ${new Intl.NumberFormat('en-IN').format(totalDonations + totalCollections - totalExpenses)}`, icon: Scale, color: "text-blue-500" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>A quick overview of your club's status.</CardDescription>
        </CardHeader>
      </Card>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map(card => (
              <Link href={card.href} key={card.title}>
                <Card className="transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
              </Link>
            ))}
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>An overview of your club's finances.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 {financeCards.map(card => (
                  <Link href={card.href} key={card.title}>
                    <Card className="transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <card.icon className={cn("h-5 w-5 text-muted-foreground", card.color)} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                        </CardContent>
                    </Card>
                  </Link>
                ))}
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
          <div className="xl:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Slider Content</CardTitle>
                <CardDescription>Photos and events marked to show on the homepage slider.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div>
                  <h4 className="font-medium mb-2">Photos on Slider ({sliderPhotos.length})</h4>
                  {sliderPhotos.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                      {sliderPhotos.map(photo => (
                        <Link href="/admin/gallery" key={photo.id}>
                          <div className="relative aspect-square w-full rounded-md overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
                            <Image src={photo.url} alt={photo.title || 'Gallery photo'} fill className="object-cover" sizes="100px" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">No photos are set to show on the slider.</p>}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Events on Slider ({sliderEvents.length})</h4>
                  {sliderEvents.length > 0 ? (
                  <Table>
                    <TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {sliderEvents.map(event => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  ) : <p className="text-sm text-muted-foreground">No events are set to show on the slider.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
          
           <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Gallery Photos</CardTitle>
                <CardDescription>The 5 most recently added photos.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                   <TableHeader><TableRow><TableHead>Photo</TableHead><TableHead>Title</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {recentPhotos.map(photo => (
                      <TableRow key={photo.id}>
                        <TableCell>
                           <div className="relative aspect-square h-12 w-12 rounded-md overflow-hidden">
                              <Image src={photo.url} alt={photo.title || 'Gallery photo'} fill className="object-cover" sizes="48px" />
                           </div>
                        </TableCell>
                        <TableCell className="font-medium">{photo.title || 'Untitled'}</TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                            <Link href="/admin/gallery"><Pencil className="h-3 w-3 mr-2" />Edit</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>The 5 most recently added events.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Date</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {recentEvents.map(event => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                            <Link href="/admin/events"><Pencil className="h-3 w-3 mr-2" />Edit</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
           </div>
        </div>
    </div>
  );
}
