
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  getAllDonations, Donation, 
  getAllCollections, Collection,
  getAllExpenses, Expense,
  getAllAchievements, Achievement,
  getAllMembers, Member,
  getAllEvents, Event,
  getAllPhotos, Photo,
} from "@/lib/data";
import { useMemo, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Users, CalendarDays, CircleDollarSign, Trophy, GalleryHorizontal, ArrowUpRight, ArrowDownRight, Scale } from "lucide-react";
import { cn } from "@/lib/utils";


export default function AdminDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donationsData, collectionsData, expensesData, achievementsData, membersData, eventsData, photosData] = await Promise.all([
        getAllDonations(),
        getAllCollections(),
        getAllExpenses(),
        getAllAchievements(),
        getAllMembers(),
        getAllEvents(),
        getAllPhotos(),
      ]);
      setDonations(donationsData);
      setCollections(collectionsData);
      setExpenses(expensesData);
      setAchievements(achievementsData);
      setMembers(membersData);
      setEvents(eventsData);
      setPhotos(photosData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ title: "Error", description: "Failed to load dashboard data.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalDonations = useMemo(() => donations.reduce((sum, d) => sum + (d.amount || 0), 0), [donations]);
  const totalCollections = useMemo(() => collections.reduce((sum, c) => sum + c.amount, 0), [collections]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  
  const summaryCards = [
    { 
      href: "/admin/members", 
      title: "Total Members", 
      value: members.length,
      icon: Users
    },
     { 
      href: "/admin/gallery", 
      title: "Total Photos", 
      value: photos.length,
      icon: GalleryHorizontal
    },
    { 
      href: "/admin/events", 
      title: "Total Events", 
      value: events.length,
      icon: CalendarDays
    },
    { 
      href: "/admin/achievements", 
      title: "Total Achievements", 
      value: achievements.length,
      icon: Trophy
    },
  ];
  
   const financeCards = [
    { 
      href: "/admin/finances", 
      title: "Total Donations", 
      value: `Rs ${new Intl.NumberFormat('en-IN').format(totalDonations)}`,
      icon: ArrowUpRight,
      color: "text-green-500"
    },
    { 
      href: "/admin/finances", 
      title: "Total Collections", 
      value: `Rs ${new Intl.NumberFormat('en-IN').format(totalCollections)}`,
      icon: ArrowUpRight,
      color: "text-green-500"
    },
    { 
      href: "/admin/finances", 
      title: "Total Expenses", 
      value: `Rs ${new Intl.NumberFormat('en-IN').format(totalExpenses)}`,
      icon: ArrowDownRight,
      color: "text-red-500"
    },
    { 
      href: "/admin/finances", 
      title: "Net Balance", 
      value: `Rs ${new Intl.NumberFormat('en-IN').format(totalDonations + totalCollections - totalExpenses)}`,
      icon: Scale,
      color: "text-blue-500"
    },
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
    </div>
  );
}
