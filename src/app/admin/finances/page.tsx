"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getAllDonations, Donation,
  getAllCollections, Collection,
  getAllExpenses, Expense,
} from "@/lib/data";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const financeSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
});

type FinanceFormValues = z.infer<typeof financeSchema>;

type FinanceCategory = 'donation' | 'collection' | 'expense';

const categoryConfig = {
  donation: {
    title: "Donation",
    stateHook: () => useState(getAllDonations()),
    setter: (set: React.Dispatch<React.SetStateAction<Donation[]>>) => (items: any[]) => set(items),
  },
  collection: {
    title: "Collection",
    stateHook: () => useState(getAllCollections()),
    setter: (set: React.Dispatch<React.SetStateAction<Collection[]>>) => (items: any[]) => set(items),
  },
  expense: {
    title: "Expense",
    stateHook: () => useState(getAllExpenses()),
    setter: (set: React.Dispatch<React.SetStateAction<Expense[]>>) => (items: any[]) => set(items),
  },
} as const;

function FinanceTable({ category }: { category: FinanceCategory }) {
  const [items, setItems] = categoryConfig[category].stateHook();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<FinanceFormValues | null>(null);
  const { toast } = useToast();

  const form = useForm<FinanceFormValues>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      title: "",
      amount: 0,
      date: "",
    },
  });
  
  const setTypedItems = categoryConfig[category].setter(setItems as any);

  const onSubmit = (data: FinanceFormValues) => {
    const isEditing = !!data.id;
    if (isEditing) {
      setTypedItems(items.map(item => item.id === data.id ? { ...item, ...data } : item));
      toast({ title: `${categoryConfig[category].title} Updated` });
    } else {
      const newItem = {
        ...data,
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
      };
      setTypedItems([...items, newItem].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      toast({ title: `${categoryConfig[category].title} Added` });
    }
    setIsDialogOpen(false);
    form.reset();
  };
  
  const handleEdit = (item: FinanceFormValues) => {
    form.reset(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTypedItems(items.filter(item => item.id !== id));
    toast({ title: `${categoryConfig[category].title} Deleted`, variant: "destructive" });
  };
  
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Manage {categoryConfig[category].title}s</CardTitle>
           <p className="text-sm text-muted-foreground">
            Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              form.reset({ id: undefined, title: "", amount: 0, date: "" });
              setIsDialogOpen(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add {categoryConfig[category].title}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{form.getValues("id") ? 'Edit' : 'Add'} {categoryConfig[category].title}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder={`${categoryConfig[category].title} title`} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.amount)}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(item as FinanceFormValues)}><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function FinancesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Finances</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Manage donations, collections, and expenses here.</p>
            </CardContent>
        </Card>

        <Tabs defaultValue="donations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="donations" className="space-y-4">
            <FinanceTable category="donation" />
          </TabsContent>
          <TabsContent value="collections" className="space-y-4">
            <FinanceTable category="collection" />
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4">
            <FinanceTable category="expense" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
