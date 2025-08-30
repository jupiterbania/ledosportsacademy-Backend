
"use client";

import React, { useState, useEffect } from 'react';
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
import { getAllPhotos, Photo, addPhoto, updatePhoto, deletePhoto, addNotification } from "@/lib/data";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

const photoSchema = z.object({
  id: z.string().optional(),
  url: z.string().url({ message: "Please enter a valid URL." }),
  title: z.string().optional(),
  description: z.string().optional(),
  isSliderPhoto: z.boolean().default(false),
  sendNotification: z.boolean().default(true),
});

type PhotoFormValues = z.infer<typeof photoSchema>;

export default function GalleryManagementPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchPhotos = async () => {
    const data = await getAllPhotos();
    setPhotos(data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      url: "https://placehold.co/600x400.png",
      isSliderPhoto: false,
      title: '',
      description: '',
      sendNotification: true,
    },
  });

  const onSubmit = async (data: PhotoFormValues) => {
    const { id, sendNotification, ...photoData } = data;
    try {
      if (id) {
        await updatePhoto(id, photoData);
        toast({ title: "Photo Updated", description: "The photo has been successfully updated." });
      } else {
        const newPhotoData = {
          ...photoData,
          uploadedAt: new Date().toISOString(),
        };
        const newPhoto = await addPhoto(newPhotoData);
        toast({ title: "Photo Added", description: "The new photo has been added to the gallery." });
        
        if (sendNotification) {
          await addNotification({
            title: `New Photo Added to Gallery`,
            description: newPhoto.title || "A new photo has been added to the gallery. Check it out!",
            link: '/gallery'
          });
          toast({ title: "Notification Sent", description: "Users have been notified about the new photo." });
        }
      }
      fetchPhotos();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
       toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  const handleEdit = (photo: Photo) => {
    form.reset({ ...photo, sendNotification: false });
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deletePhoto(id);
      fetchPhotos();
      toast({ title: "Photo Deleted", description: "The photo has been removed from the gallery.", variant: "destructive" });
    } catch (error) {
       toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gallery Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button size="sm" onClick={() => {
                  form.reset({
                    id: undefined,
                    url: "https://placehold.co/600x400.png",
                    isSliderPhoto: false,
                    title: '',
                    description: '',
                    sendNotification: true,
                  });
                  setIsDialogOpen(true);
                }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>{form.getValues("id") ? 'Edit Photo' : 'Add New Photo'}</DialogTitle>
              </DialogHeader>
               <div className="flex-grow overflow-y-auto pr-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="url"
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
                          <FormLabel>Title (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="A nice title for the photo" {...field} />
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
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="A short description of the photo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="isSliderPhoto"
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
                               <p className="text-xs text-muted-foreground">Notify users about this new photo.</p>
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
                      <Button type="submit">Save Photo</Button>
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
                <TableHead>Photo</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">On Slider</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {photos.map((photo) => (
                <TableRow key={photo.id}>
                   <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0">
                           <Image src={photo.url} alt={photo.title || `Photo ${photo.id}`} fill className="object-cover" sizes="64px" />
                        </div>
                         <div className="flex flex-col">
                            <span className="font-medium">{photo.title || 'Untitled'}</span>
                            <a href={photo.url} target="_blank" rel="noopener noreferrer" className="truncate text-sm text-muted-foreground hover:underline hidden sm:inline-block max-w-[150px] lg:max-w-[250px]">{photo.url}</a>
                         </div>
                      </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{photo.description || 'N/A'}</TableCell>
                   <TableCell className="hidden md:table-cell">
                     {photo.isSliderPhoto ? (
                       <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                       <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                       <Button variant="outline" size="icon" onClick={() => handleEdit(photo)}>
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
                                This action cannot be undone. This will permanently delete the photo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(photo.id)}>Delete</AlertDialogAction>
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
    </div>
  );
}
