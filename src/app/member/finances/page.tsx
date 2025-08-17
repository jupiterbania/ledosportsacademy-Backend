"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getAllDonations, Donation,
  getAllCollections, Collection,
  getAllExpenses, Expense,
} from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DonationsTable() {
  const items = useMemo(() => getAllDonations(), []);
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + (item.amount || 0), 0), [items]);

  return (
     <Card>
      <CardHeader>
        <CardTitle>Donations</CardTitle>
        <CardDescription>
          Total Monetary Donations: INR {new Intl.NumberFormat('en-IN').format(totalAmount)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  {item.amount !== undefined ? `INR ${new Intl.NumberFormat('en-IN').format(item.amount)}` : item.item}
                </TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function FinanceTable({ 
    title,
    data, 
}: { 
    title: string,
    data: (Collection[] | Expense[]),
}) {
  const items = useMemo(() => data, [data]);
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Total: INR {new Intl.NumberFormat('en-IN').format(totalAmount)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>INR {new Intl.NumberFormat('en-IN').format(item.amount)}</TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function MemberFinancesPage() {
  const collections = useMemo(() => getAllCollections(), []);
  const expenses = useMemo(() => getAllExpenses(), []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 animate-fade-in">
        <Card>
            <CardHeader>
                <CardTitle>Financial Records</CardTitle>
                <CardDescription>A view-only summary of the club's financial activities.</CardDescription>
            </CardHeader>
        </Card>

        <Tabs defaultValue="donations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="donations" className="space-y-4">
            <DonationsTable />
          </TabsContent>
          <TabsContent value="collections" className="space-y-4">
             <FinanceTable
                title="Collections"
                data={collections}
            />
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4">
             <FinanceTable
                title="Expenses"
                data={expenses}
            />
          </TabsContent>
        </Tabs>
    </main>
  );
}
