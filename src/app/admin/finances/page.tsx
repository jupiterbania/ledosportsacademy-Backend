
"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
  getAllDonations, Donation, addDonation, updateDonation, deleteDonation,
  getAllCollections, Collection, addCollection, updateCollection, deleteCollection,
  getAllExpenses, Expense, addExpense, updateExpense, deleteExpense
} from "@/lib/data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from '@/components/ui/textarea';

const donationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  donorName: z.string().optional(),
  description: z.string().optional(),
  date: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Date is required" }),
  donationType: z.enum(['money', 'item']).default('money'),
  amount: z.any().optional(),
  item: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.donationType === 'money') {
        const parsedAmount = parseFloat(data.amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Amount must be a positive number.",
                path: ['amount'],
            });
        }
    }
    if (data.donationType === 'item' && (!data.item || data.item.trim().length === 0)) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Item description is required.",
            path: ['item'],
        });
    }
});


const collectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  description: z.string().optional(),
});

const expenseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  description: z.string().optional(),
});


type DonationFormValues = z.infer<typeof donationSchema>;
type CollectionFormValues = z.infer<typeof collectionSchema>;
type ExpenseFormValues = z.infer<typeof expenseSchema>;

function DonationTable() {
  const [items, setItems] = useState<Donation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => setItems(await getAllDonations());
  useEffect(() => { fetchItems() }, []);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      title: "",
      date: "",
      donationType: 'money',
      amount: "",
      item: "",
      donorName: "",
      description: "",
    },
  });

  const donationType = form.watch("donationType");

  const onSubmit = async (data: DonationFormValues) => {
    const { id, ...donationData } = data;
    
    let submittedData: Omit<Donation, 'id'>;

    if (donationData.donationType === 'money') {
        submittedData = {
            title: donationData.title,
            date: donationData.date,
            donorName: donationData.donorName,
            description: donationData.description,
            amount: parseFloat(donationData.amount),
        };
    } else {
         submittedData = {
            title: donationData.title,
            date: donationData.date,
            donorName: donationData.donorName,
            description: donationData.description,
            item: donationData.item,
        };
    }

    try {
      if (id) {
        await updateDonation(id, submittedData);
        toast({ title: "Donation Updated" });
      } else {
        await addDonation(submittedData);
        toast({ title: "Donation Added" });
      }
      fetchItems();
      setIsDialogOpen(false);
      form.reset({ title: "", date: "", donationType: 'money', amount: "", item: "", donorName: "", description: "" });
    } catch (error) {
      console.error("Failed to save donation: ", error);
      toast({ title: "Error", variant: "destructive", description: "Could not save the donation." });
    }
  };

  const handleEdit = (item: Donation) => {
    const donationType = item.amount !== undefined ? 'money' : 'item';
    form.reset({...item, donationType, amount: item.amount ?? '' });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDonation(id);
      fetchItems();
      toast({ title: "Donation Deleted", variant: "destructive" });
    } catch (error) {
       toast({ title: "Error", variant: "destructive" });
    }
  };
  
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + (item.amount || 0), 0), [items]);

  return (
     <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Manage Donations</CardTitle>
           <p className="text-sm text-muted-foreground">
            Total: Rs {new Intl.NumberFormat('en-IN').format(totalAmount)}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if(!open) {
                form.reset({ id: undefined, title: "", amount: "", date: "", donationType: 'money', item: "", donorName: "", description: "" });
            }
            setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              Add Donation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{form.getValues("id") ? 'Edit' : 'Add'} Donation</DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="e.g. 'Annual Gala Sponsorship'" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="donorName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donor Name</FormLabel>
                    <FormControl><Input placeholder="John Doe or Anonymous" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField
                  control={form.control}
                  name="donationType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Donation Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="money" />
                            </FormControl>
                            <FormLabel className="font-normal">Money</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="item" />
                            </FormControl>
                            <FormLabel className="font-normal">Item</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {donationType === 'money' ? (
                  <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ) : (
                  <FormField control={form.control} name="item" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Description</FormLabel>
                      <FormControl><Textarea placeholder="Describe the donated item(s)" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                 <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="A short description about the donation" {...field} /></FormControl>
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
                <DialogFooter className="sticky bottom-0 bg-background py-4 -mx-6 px-6 border-t">
                  <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Donor</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="hidden md:table-cell">{item.donorName || 'N/A'}</TableCell>
                <TableCell className="hidden lg:table-cell">{item.description || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  {item.amount !== undefined ? `Rs ${new Intl.NumberFormat('en-IN').format(item.amount)}` : item.item}
                </TableCell>
                <TableCell className="hidden md:table-cell">{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
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


function FinanceTable<T extends Collection | Expense>({ 
    category, 
    title,
    schema,
    getAll,
    add,
    update,
    del,
}: { 
    category: 'collection' | 'expense',
    title: string,
    schema: z.ZodType<any, any>,
    getAll: () => Promise<T[]>,
    add: (data: Omit<T, 'id'>) => Promise<any>,
    update: (id: string, data: Partial<T>) => Promise<void>,
    del: (id: string) => Promise<void>,
}) {
  const [items, setItems] = useState<T[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => setItems(await getAll());
  useEffect(() => { fetchItems() }, []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      amount: 0,
      date: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const { id, ...itemData } = data;
    try {
        if (id) {
            await update(id, itemData);
            toast({ title: `${title} Updated` });
        } else {
            await add(itemData);
            toast({ title: `${title} Added` });
        }
        fetchItems();
        setIsDialogOpen(false);
        form.reset();
    } catch (error) {
        toast({ title: "Error", variant: "destructive" });
    }
  };
  
  const handleEdit = (item: T) => {
    form.reset(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
        await del(id);
        fetchItems();
        toast({ title: `${title} Deleted`, variant: "destructive" });
    } catch (error) {
        toast({ title: "Error", variant: "destructive" });
    }
  };
  
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Manage {title}s</CardTitle>
           <p className="text-sm text-muted-foreground">
            Total: Rs {new Intl.NumberFormat('en-IN').format(totalAmount)}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => {
              form.reset({ id: undefined, title: "", amount: 0, date: "", description: "" });
              setIsDialogOpen(true);
            }}>
              Add {title}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{form.getValues("id") ? 'Edit' : 'Add'} {title}</DialogTitle>
            </DialogHeader>
             <div className="flex-grow overflow-y-auto pr-4 -mr-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl><Input placeholder={`${title} title`} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl><Textarea placeholder={`A short description for the ${category}`} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(+e.target.value)}/></FormControl>
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
                  <DialogFooter className="sticky bottom-0 bg-background py-4 -mx-6 px-6 border-t">
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{item.description || 'N/A'}</TableCell>
                <TableCell className="text-right">Rs {new Intl.NumberFormat('en-IN').format(item.amount)}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
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
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="donations" className="space-y-4">
            <DonationTable />
          </TabsContent>
          <TabsContent value="collections" className="space-y-4">
             <FinanceTable
                category="collection"
                title="Collection"
                schema={collectionSchema}
                getAll={getAllCollections}
                add={addCollection}
                update={updateCollection}
                del={deleteCollection}
            />
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4">
             <FinanceTable
                category="expense"
                title="Expense"
                schema={expenseSchema}
                getAll={getAllExpenses}
                add={addExpense}
                update={updateExpense}
                del={deleteExpense}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

    