"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAllAchievements, Achievement, addAchievement, updateAchievement, deleteAchievement } from "@/lib/data";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

const achievementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  photoUrl: z.string().url({ message: "Please enter a valid URL." }),
  'data-ai-hint': z.string().optional(),
});

type AchievementFormValues = z.infer<typeof achievementSchema>;

export default function AchievementsManagementPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchAchievements = async () => {
    const data = await getAllAchievements();
    setAchievements(data);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      photoUrl: "https://placehold.co/600x400.png",
      'data-ai-hint': "",
    },
  });

  const onSubmit = async (data: AchievementFormValues) => {
    const { id, ...achievementData } = data;
    try {
      if (id) {
        await updateAchievement(id, achievementData);
        toast({ title: "Achievement Updated", description: "The achievement has been successfully updated." });
      } else {
        await addAchievement(achievementData);
        toast({ title: "Achievement Added", description: "The new achievement has been recorded." });
      }
      fetchAchievements();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  const handleEdit = (achievement: Achievement) => {
    form.reset(achievement);
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteAchievement(id);
      fetchAchievements();
      toast({ title: "Achievement Deleted", description: "The achievement has been removed.", variant: "destructive" });
    } catch (error) {
       toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Achievements</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button onClick={() => {
                  form.reset({
                    id: undefined,
                    title: "",
                    description: "",
                    date: "",
                    photoUrl: "https://placehold.co/600x400.png",
                    'data-ai-hint': "",
                  });
                  setIsDialogOpen(true);
                }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Achievement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{form.getValues("id") ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
              </DialogHeader>
               <ScrollArea className="pr-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Tournament Champions" {...field} />
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
                            <Textarea placeholder="Won the regional tournament..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                             <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="photoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://placehold.co/600x400.png" {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="data-ai-hint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Hint</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 'award trophy'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="sticky bottom-0 bg-background py-4">
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save Achievement</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Photo</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievements.map((achievement) => (
                <TableRow key={achievement.id}>
                    <TableCell className="hidden sm:table-cell">
                         <div className="relative h-16 w-16 rounded-md overflow-hidden">
                           <Image src={achievement.photoUrl} alt={`Photo for ${achievement.title}`} fill className="object-cover" sizes="64px" />
                        </div>
                    </TableCell>
                  <TableCell className="font-medium">{achievement.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{achievement.description}</TableCell>
                  <TableCell className="hidden lg:table-cell">{new Date(achievement.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                       <Button variant="outline" size="icon" onClick={() => handleEdit(achievement)}>
                        <Edit className="h-4 w-4" />
                         <span className="sr-only">Edit</span>
                      </Button>
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
                                This action cannot be undone. This will permanently delete the achievement.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(achievement.id)}>Delete</AlertDialogAction>
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
    </main>
  );
}
