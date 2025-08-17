"use client";

import React, { useState } from 'react';
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
import { getAllAchievements, Achievement } from "@/lib/data";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const achievementSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
});

type AchievementFormValues = z.infer<typeof achievementSchema>;

export default function AchievementsManagementPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(getAllAchievements());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
    },
  });

  const onSubmit = (data: AchievementFormValues) => {
    const isEditing = !!data.id;
    if (isEditing) {
      setAchievements(achievements.map(achievement => achievement.id === data.id ? { ...achievement, ...data } : achievement));
      toast({ title: "Achievement Updated", description: "The achievement has been successfully updated." });
    } else {
      const newAchievement: Achievement = {
        ...data,
        id: achievements.length > 0 ? Math.max(...achievements.map(e => e.id)) + 1 : 1,
      };
      setAchievements([...achievements, newAchievement].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      toast({ title: "Achievement Added", description: "The new achievement has been recorded." });
    }
    setIsDialogOpen(false);
    form.reset();
  };

  const handleEdit = (achievement: Achievement) => {
    form.reset(achievement);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
    setAchievements(achievements.filter(achievement => achievement.id !== id));
    toast({ title: "Achievement Deleted", description: "The achievement has been removed.", variant: "destructive" });
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
                  });
                  setIsDialogOpen(true);
                }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Achievement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{form.getValues("id") ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
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
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Achievement</Button>
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
                <TableHead>Description</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievements.map((achievement) => (
                <TableRow key={achievement.id}>
                  <TableCell className="font-medium">{achievement.title}</TableCell>
                  <TableCell>{achievement.description}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(achievement.date).toLocaleDateString()}</TableCell>
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
