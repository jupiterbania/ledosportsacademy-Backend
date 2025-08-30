
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getAllDonations, Donation,
  getAllCollections, Collection,
  getAllExpenses, Expense,
} from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DonationsTable() {
  const [items, setItems] = useState<Donation[]>([]);
  useEffect(() => {
    getAllDonations().then(setItems);
  }, []);

  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + (item.amount || 0), 0), [items]);

  return (
     <Card>
      <CardHeader>
        <CardTitle>Donations</CardTitle>
        <CardDescription>
          Total Monetary Donations: Rs {new Intl.NumberFormat('en-IN').format(totalAmount)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Donor</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.donorName || 'N/A'}</TableCell>
                <TableCell>{item.description || 'N/A'}</TableCell>
                <TableCell>
                  {item.amount !== undefined ? `Rs ${new Intl.NumberFormat('en-IN').format(item.amount)}` : item.item}
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
    fetchData, 
}: { 
    title: string,
    fetchData: () => Promise<(Collection[] | Expense[])>,
}) {
  const [items, setItems] = useState<(Collection[] | Expense[])>([]);

  useEffect(() => {
    fetchData().then(setItems);
  }, [fetchData]);
  
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + (item as Collection).amount, 0), [items]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Total: Rs {new Intl.NumberFormat('en-IN').format(totalAmount)}
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
                <TableCell>Rs {new Intl.NumberFormat('en-IN').format((item as Collection).amount)}</TableCell>
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
                fetchData={getAllCollections}
            />
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4">
             <FinanceTable
                title="Expenses"
                fetchData={getAllExpenses}
            />
          </TabsContent>
        </Tabs>
    </main>
  );
}

    
