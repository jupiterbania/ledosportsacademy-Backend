
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAllEvents, Event, addEvent, updateEvent, deleteEvent, addNotification } from "@/lib/data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { enhanceText } from '@/ai/flows/generate-photo-details-flow';
import { Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  photoUrl: z.string().url({ message: "Please enter a valid URL." }),
  redirectUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  showOnSlider: z.boolean().default(false),
  sendNotification: z.boolean().default(true),
  aiTopic: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const fetchEvents = async () => {
    const data = await getAllEvents();
    setEvents(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      photoUrl: "https://placehold.co/600x400.png",
      redirectUrl: "",
      showOnSlider: false,
      sendNotification: true,
      aiTopic: "",
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    const { id, sendNotification, aiTopic, ...eventData } = data;
    try {
      if (id) {
        await updateEvent(id, eventData);
        toast({ title: "Event Updated", description: "The event has been successfully updated." });
      } else {
        const newEvent = await addEvent(eventData);
        toast({ title: "Event Created", description: "The new event has been added." });
        if(sendNotification) {
          await addNotification({
            title: `New Event: ${newEvent.title}`,
            description: newEvent.description.substring(0, 100) + (newEvent.description.length > 100 ? '...' : ''),
            link: `/events`,
          });
          toast({ title: "Notification Sent", description: "Users have been notified about the new event." });
        }
      }
      fetchEvents();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  const handleEdit = (event: Event) => {
    form.reset({ ...event, sendNotification: false, aiTopic: "" });
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      fetchEvents();
      toast({ title: "Event Deleted", description: "The event has been removed.", variant: "destructive" });
    } catch (error) {
       toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };
  
  const handleAiAction = async (action: 'enhance' | 'generate', fieldToUpdate?: 'title' | 'description') => {
    const title = form.getValues("title");
    const description = form.getValues("description");
    const topic = form.getValues("aiTopic");

    if (action === 'enhance' && !title && !description) {
      toast({ title: "Input Required", description: "Please provide a title or description to enhance.", variant: "destructive"});
      return;
    }

    if (action === 'generate' && !topic) {
        toast({ title: "Topic Required", description: "Please provide a topic for the AI to generate content.", variant: "destructive"});
        return;
    }
    
    setIsGenerating(true);
    try {
        const input = action === 'generate' 
            ? { topic, context: 'event' as const } 
            : { title: fieldToUpdate === 'title' ? title : '', description: fieldToUpdate === 'description' ? description : '', context: 'event' as const };

        const result = await enhanceText(input);

        if(action === 'generate') {
          form.setValue('title', result.title, { shouldValidate: true });
          form.setValue('description', result.description, { shouldValidate: true });
          toast({ title: "Content Generated", description: "Title and description have been generated by AI." });
        } else {
          if (fieldToUpdate === 'title') {
            form.setValue('title', result.title, { shouldValidate: true });
          } else if (fieldToUpdate === 'description') {
            form.setValue('description', result.description, { shouldValidate: true });
          }
          toast({ title: "Content Enhanced", description: "Content has been improved by AI." });
        }
    } catch (error) {
        console.error("AI action failed:", error);
        toast({ title: "AI Error", description: "Could not perform AI action. Please try again.", variant: "destructive" });
    } finally {
        setIsGenerating(false);
    }
  };
  
  const EventActions = ({ event }: { event: Event }) => (
    <div className="flex gap-2">
       <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
         Edit
      </Button>
       <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button variant="destructive" size="sm">
                Delete
              </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(event.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Events Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button size="sm" onClick={() => {
                  form.reset({
                    id: undefined,
                    title: "",
                    description: "",
                    date: "",
                    photoUrl: "https://placehold.co/600x400.png",
                    redirectUrl: "",
                    showOnSlider: false,
                    sendNotification: true,
                    aiTopic: "",
                  });
                  setIsDialogOpen(true);
                }}>
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>{form.getValues("id") ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              </DialogHeader>
              <div className="flex-grow overflow-y-auto pr-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="aiTopic"
                        render={({ field }) => (
                            <FormItem className="bg-muted/50 p-4 rounded-lg border">
                                <FormLabel className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary"/>
                                    Generate with AI
                                </FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the event in a few words (e.g., 'annual football tournament for under-16s') and the AI will write the title and description for you." {...field} />
                                </FormControl>
                                <Button type="button" onClick={() => handleAiAction('generate')} disabled={isGenerating || !field.value} className="mt-2 w-full">
                                    {isGenerating ? 'Generating...' : 'Generate Title & Description'}
                                    <Sparkles className={`ml-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`}/>
                                </Button>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <Separator />
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
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input placeholder="Annual General Meeting" {...field} className="pr-28" />
                            </FormControl>
                            <Button 
                              type="button" 
                              onClick={() => handleAiAction('enhance', 'title')}
                              disabled={isGenerating || !field.value}
                              variant="outline"
                              size="sm"
                              className="absolute top-1/2 -translate-y-1/2 right-1.5 h-7"
                            >
                              <Sparkles className={`mr-1.5 h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                              Enhance
                            </Button>
                          </div>
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
                          <div className="relative">
                            <FormControl>
                              <Textarea placeholder="Join us for our annual general meeting..." {...field} className="pr-28" />
                            </FormControl>
                            <Button 
                              type="button" 
                              onClick={() => handleAiAction('enhance', 'description')}
                              disabled={isGenerating || !field.value}
                              variant="outline"
                              size="sm"
                              className="absolute top-2.5 right-1.5 h-7"
                            >
                              <Sparkles className={`mr-1.5 h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                              Enhance
                            </Button>
                          </div>
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
                      name="redirectUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Redirect URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/event-details" {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="showOnSlider"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Show on Homepage Slider</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {!form.getValues("id") && (
                      <FormField
                        control={form.control}
                        name="sendNotification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Send Notification</FormLabel>
                              <p className="text-xs text-muted-foreground">Notify users about this new event.</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    <DialogFooter className="sticky bottom-0 bg-background py-4 -mx-6 px-6 border-t">
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save Event</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          <div className="grid gap-4 md:hidden">
            {events.map((event) => (
              <Card key={event.id}>
                <div className="relative aspect-video w-full">
                  <Image src={event.photoUrl} alt={event.title} fill className="object-cover rounded-t-lg" sizes="100vw"/>
                </div>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                   <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                   <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                   <div>
                    <Badge variant={event.showOnSlider ? "default" : "outline"}>
                      {event.showOnSlider ? "On Slider" : "Not on Slider"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <EventActions event={event} />
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>On Slider</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="relative h-16 w-24 rounded-md overflow-hidden">
                        <Image src={event.photoUrl} alt={event.title} fill className="object-cover" sizes="96px" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                       {event.showOnSlider ? (
                         <Badge>Yes</Badge>
                        ) : (
                         <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                    <TableCell>
                      <EventActions event={event} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
