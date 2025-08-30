
"use client";

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  getAllDonations, Donation,
  getAllCollections, Collection,
  getAllExpenses, Expense,
  getAllAchievements, Achievement,
  getAllMembers, Member,
  getAllEvents, Event,
} from "@/lib/data";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineDescription,
  TimelineContent,
} from "@/components/ui/timeline";
import { Medal, Users, Calendar, HandCoins, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';


const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AnalyticsDashboardPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setDonations(await getAllDonations());
      setCollections(await getAllCollections());
      setExpenses(await getAllExpenses());
      setAchievements(await getAllAchievements());
      setMembers(await getAllMembers());
      setEvents(await getAllEvents());
    };
    fetchData();
  }, []);

  const totalDonations = useMemo(() => donations.reduce((sum, d) => sum + (d.amount || 0), 0), [donations]);
  const totalCollections = useMemo(() => collections.reduce((sum, c) => sum + c.amount, 0), [collections]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  
  const financialSummaryData = useMemo(() => [
    { name: 'Donations', value: totalDonations },
    { name: 'Collections', value: totalCollections },
    { name: 'Expenses', value: totalExpenses },
  ], [totalDonations, totalCollections, totalExpenses]);

  const monthlyFinancials = useMemo(() => {
    const data: { [key: string]: { month: string, donations: number, collections: number, expenses: number } } = {};
    const monetaryDonations = donations.filter(d => typeof d.amount === 'number');

    const processItems = (items: any[], type: 'donations' | 'collections' | 'expenses') => {
        items.forEach(item => {
            const month = new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!data[month]) {
                data[month] = { month, donations: 0, collections: 0, expenses: 0 };
            }
            data[month][type] += item.amount || 0;
        });
    };
    
    processItems(monetaryDonations, 'donations');
    processItems(collections, 'collections');
    processItems(expenses, 'expenses');
    
    return Object.values(data).sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [donations, collections, expenses]);

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>An overview of your club's data and progress.</CardDescription>
        </CardHeader>
      </Card>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                    <ArrowUpCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Rs {new Intl.NumberFormat('en-IN').format(totalDonations)}</div>
                    <p className="text-xs text-muted-foreground">Total monetary donations received</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
                    <ArrowUpCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Rs {new Intl.NumberFormat('en-IN').format(totalCollections)}</div>
                    <p className="text-xs text-muted-foreground">Total funds collected</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <ArrowDownCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Rs {new Intl.NumberFormat('en-IN').format(totalExpenses)}</div>
                    <p className="text-xs text-muted-foreground">Total funds spent</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                    <HandCoins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Rs {new Intl.NumberFormat('en-IN').format(totalDonations + totalCollections - totalExpenses)}</div>
                    <p className="text-xs text-muted-foreground">Total income minus expenses</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{members.length}</div>
                    <p className="text-xs text-muted-foreground">Currently active members</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                    <p className="text-xs text-muted-foreground">Total events hosted</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
                    <Medal className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{achievements.length}</div>
                    <p className="text-xs text-muted-foreground">Total achievements recorded</p>
                </CardContent>
            </Card>
        </div>


      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Financials</CardTitle>
            <CardDescription>A breakdown of income and expenses over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyFinancials}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `Rs ${new Intl.NumberFormat('en-IN').format(value)}`} />
                  <Tooltip formatter={(value: number) => `Rs ${new Intl.NumberFormat('en-IN').format(value)}`} contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="donations" stroke="hsl(var(--chart-1))" name="Donations" />
                  <Line type="monotone" dataKey="collections" stroke="hsl(var(--chart-2))" name="Collections" />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-3))" name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>A pie chart showing the proportion of all financial activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={financialSummaryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {financialSummaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `Rs ${new Intl.NumberFormat('en-IN').format(value)}`} contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}/>
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Achievement Timeline</CardTitle>
            <CardDescription>A history of the club's major milestones.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-y-auto">
               <Timeline>
                {achievements.map((achievement, index) => (
                  <TimelineItem key={achievement.id}>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon>
                        <Medal className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>{achievement.title}</TimelineTitle>
                    </TimelineHeader>
                    <TimelineContent>
                      <p className="text-sm text-muted-foreground">{new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p>{achievement.description}</p>
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
