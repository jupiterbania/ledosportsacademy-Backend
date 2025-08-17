"use client";

import React, { useState } from 'react';
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
import { getAllPhotos, Photo } from "@/lib/data";
import { PlusCircle, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';

const photoSchema = z.object({
  id: z.number().optional(),
  url: z.string().url({ message: "Please enter a valid URL." }),
  'data-ai-hint': z.string().optional(),
  isSliderPhoto: z.boolean().default(false),
});

type PhotoFormValues = z.infer<typeof photoSchema>;

export default function GalleryManagementPage() {
  const [photos, setPhotos] = useState<Photo[]>(getAllPhotos());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      url: "https://placehold.co/600x400.png",
      isSliderPhoto: false,
      'data-ai-hint': '',
    },
  });

  const onSubmit = (data: PhotoFormValues) => {
    const isEditing = !!data.id;
    if (isEditing) {
      setPhotos(photos.map(photo => photo.id === data.id ? { ...photo, ...data } : photo));
      toast({ title: "Photo Updated", description: "The photo has been successfully updated." });
    } else {
      const newPhoto: Photo = {
        ...data,
        id: photos.length > 0 ? Math.max(...photos.map(p => p.id)) + 1 : 1,
        uploadedAt: new Date().toISOString(),
      };
      setPhotos([newPhoto, ...photos]);
      toast({ title: "Photo Added", description: "The new photo has been added to the gallery." });
    }
    setIsDialogOpen(false);
    form.reset();
  };

  const handleEdit = (photo: Photo) => {
    form.reset(photo);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
    setPhotos(photos.filter(photo => photo.id !== id));
    toast({ title: "Photo Deleted", description: "The photo has been removed from the gallery.", variant: "destructive" });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gallery Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button onClick={() => {
                  form.reset({
                    id: undefined,
                    url: "https://placehold.co/600x400.png",
                    'data-ai-hint': '',
                    isSliderPhoto: false,
                  });
                  setIsDialogOpen(true);
                }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{form.getValues("id") ? 'Edit Photo' : 'Add New Photo'}</DialogTitle>
              </DialogHeader>
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
                    name="data-ai-hint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Hint</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 'community event'" {...field} />
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
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Photo</Button>
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
                <TableHead>Photo</TableHead>
                <TableHead className="hidden md:table-cell">AI Hint</TableHead>
                <TableHead className="hidden md:table-cell">On Slider</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {photos.map((photo) => (
                <TableRow key={photo.id}>
                   <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                           <Image src={photo.url} alt={`Photo ${photo.id}`} fill className="object-cover" sizes="64px" />
                        </div>
                         <a href={photo.url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium hover:underline max-w-[200px]">{photo.url}</a>
                      </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{photo['data-ai-hint'] || 'N/A'}</TableCell>
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
    </main>
  );
}
