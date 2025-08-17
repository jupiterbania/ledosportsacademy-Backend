"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins, Medal, Users, Calendar } from "lucide-react";
import {
  getAllDonations,
  getAllCollections,
  getAllExpenses,
  getAllAchievements,
  getAllMembers,
  getAllEvents,
} from "@/lib/data";
import { useMemo } from "react";
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

export default function AdminDashboard() {
  const donations = useMemo(() => getAllDonations(), []);
  const collections = useMemo(() => getAllCollections(), []);
  const expenses = useMemo(() => getAllExpenses(), []);
  const achievements = useMemo(() => getAllAchievements(), []);
  const members = useMemo(() => getAllMembers(), []);
  const events = useMemo(() => getAllEvents(), []);

  const totalDonations = useMemo(() => donations.reduce((sum, d) => sum + (d.amount || 0), 0), [donations]);
  const totalCollections = useMemo(() => collections.reduce((sum, c) => sum + c.amount, 0), [collections]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  
  const financialData = [
    { name: "Donations", value: totalDonations, fill: "hsl(var(--chart-1))" },
    { name: "Collections", value: totalCollections, fill: "hsl(var(--chart-2))" },
    { name: "Expenses", value: totalExpenses, fill: "hsl(var(--chart-3))" },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
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
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
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
                  <Bar dataKey="value" name="Amount (INR)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
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
      </div>
    </main>
  );
}
