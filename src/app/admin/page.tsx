"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins, Medal, Sprout } from "lucide-react";
import {
  getAllDonations, Donation,
  getAllCollections, Collection,
  getAllExpenses, Expense,
  getAllAchievements, Achievement,
  seedDatabase
} from "@/lib/data";
import { useMemo, useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, Legend, YAxis } from "recharts";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineDescription,
} from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setDonations(await getAllDonations());
    setCollections(await getAllCollections());
    setExpenses(await getAllExpenses());
    setAchievements(await getAllAchievements());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seedDatabase();
      toast({ title: "Database Seeded", description: "Sample data has been added successfully." });
      await fetchData(); // Refresh data after seeding
    } catch (error) {
      console.error(error);
      toast({ title: "Error Seeding Database", description: "Something went wrong.", variant: "destructive" });
    }
    setLoading(false);
  }

  const totalDonations = useMemo(() => donations.reduce((sum, d) => sum + (d.amount || 0), 0), [donations]);
  const totalCollections = useMemo(() => collections.reduce((sum, c) => sum + c.amount, 0), [collections]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  
  const financialData = useMemo(() => [
    { name: "Donations", value: totalDonations, fill: "hsl(var(--chart-1))" },
    { name: "Collections", value: totalCollections, fill: "hsl(var(--chart-2))" },
    { name: "Expenses", value: totalExpenses, fill: "hsl(var(--chart-3))" },
  ], [totalDonations, totalCollections, totalExpenses]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Seed Database</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">
              Click the button to populate your application with sample data.
            </p>
          </div>
          <Button onClick={handleSeed} disabled={loading}>
            <Sprout className="mr-2 h-4 w-4" />
            {loading ? 'Seeding...' : 'Seed Database'}
          </Button>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-y-auto">
              <Timeline>
                {achievements.slice(0, 5).map((achievement, index) => (
                  <TimelineItem key={achievement.id}>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon>
                        <Medal className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>{achievement.title}</TimelineTitle>
                    </TimelineHeader>
                    <TimelineDescription>
                      {new Date(achievement.date).toLocaleDateString()}
                    </TimelineDescription>
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                   <YAxis tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN').format(value)}`} />
                  <Tooltip
                     formatter={(value: number) => `₹${new Intl.NumberFormat('en-IN').format(value)}`}
                    contentStyle={{
                      background: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{new Intl.NumberFormat('en-IN').format(totalDonations)}</div>
            <p className="text-xs text-muted-foreground">{donations.length} donations recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{new Intl.NumberFormat('en-IN').format(totalCollections)}</div>
            <p className="text-xs text-muted-foreground">{collections.length} collections recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{new Intl.NumberFormat('en-IN').format(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} expenses recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground">{achievements.length} achievements recorded</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
