
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
} from "@/lib/data";
import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineContent,
} from "@/components/ui/timeline";
import { useToast } from "@/hooks/use-toast";
import { Users, CalendarDays, CircleDollarSign, Trophy } from "lucide-react";


export default function AdminDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donationsData, collectionsData, expensesData, achievementsData, membersData, eventsData] = await Promise.all([
        getAllDonations(),
        getAllCollections(),
        getAllExpenses(),
        getAllAchievements(),
        getAllMembers(),
        getAllEvents(),
      ]);
      setDonations(donationsData);
      setCollections(collectionsData);
      setExpenses(expensesData);
      setAchievements(achievementsData);
      setMembers(membersData);
      setEvents(eventsData);
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
  
  const monthlyFinancials = useMemo(() => {
    const data: { [key: string]: { month: string, income: number, expenses: number } } = {};
    const monetaryDonations = donations.filter(d => typeof d.amount === 'number');

    const processItems = (items: any[], type: 'income' | 'expenses') => {
        items.forEach(item => {
            const month = new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!data[month]) {
                data[month] = { month, income: 0, expenses: 0 };
            }
            data[month][type] += item.amount || 0;
        });
    };
    
    processItems(monetaryDonations, 'income');
    processItems(collections, 'income');
    processItems(expenses, 'expenses');
    
    return Object.values(data).sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [donations, collections, expenses]);


  const summaryCards = [
    { 
      href: "/admin/members", 
      title: "Total Members", 
      value: members.length,
      description: "Currently active members",
      icon: Users
    },
    { 
      href: "/admin/events", 
      title: "Upcoming Events", 
      value: events.filter(e => new Date(e.date) >= new Date()).length,
      description: `${events.length} total events`,
      icon: CalendarDays
    },
    { 
      href: "/admin/finances", 
      title: "Net Balance", 
      value: `Rs ${new Intl.NumberFormat('en-IN').format(totalDonations + totalCollections - totalExpenses)}`,
      description: "Income - Expenses",
      icon: CircleDollarSign
    },
    { 
      href: "/admin/achievements", 
      title: "Achievements", 
      value: achievements.length,
      description: "Total achievements recorded",
      icon: Trophy
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
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
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
              </Link>
            ))}
        </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
         <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Monthly income vs expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyFinancials}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `Rs ${new Intl.NumberFormat('en-IN', {notation: 'compact'})}`} />
                  <Tooltip formatter={(value: number) => `Rs ${new Intl.NumberFormat('en-IN').format(value)}`} contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-2))" name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-1))" name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>A look at the latest accomplishments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] overflow-y-auto pr-4">
              <Timeline>
                {achievements.slice(0, 5).map((achievement, index) => (
                  <TimelineItem key={achievement.id}>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon />
                      <TimelineTitle>{achievement.title}</TimelineTitle>
                    </TimelineHeader>
                    <TimelineContent>
                      <p className="text-sm text-muted-foreground">{new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
