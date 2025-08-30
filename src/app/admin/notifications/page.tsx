
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAllNotifications, Notification, addNotification, deleteNotification } from "@/lib/data";
import { PlusCircle, Trash2, Bell } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from 'date-fns';

const notificationSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  link: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function NotificationsManagementPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    const data = await getAllNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
    },
  });

  const onSubmit = async (data: NotificationFormValues) => {
    try {
      await addNotification(data);
      toast({ title: "Notification Sent", description: "The announcement has been sent to all users." });
      fetchNotifications();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
      toast({ title: "Notification Deleted", description: "The notification has been removed.", variant: "destructive" });
    } catch (error) {
       toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Send Notifications</CardTitle>
            <CardDescription>Create and send announcements to all users.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button onClick={() => {
                  form.reset({
                    title: "",
                    description: "",
                    link: "",
                  });
                  setIsDialogOpen(true);
                }}>
                <PlusCircle className="mr-2 h-4 w-4" /> New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Important Maintenance Notice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Details about the announcement..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/more-info" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Send Notification</Button>
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
                <TableHead>Notification</TableHead>
                <TableHead className="hidden md:table-cell">Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-full">
                           <Bell className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            {notification.link && (
                                <a href={notification.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                    View Link
                                </a>
                            )}
                        </div>
                      </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {notification.createdAt ? formatDistanceToNow(new Date((notification.createdAt as any).seconds * 1000), { addSuffix: true }) : 'Just now'}
                  </TableCell>
                  <TableCell>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the notification.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(notification.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
