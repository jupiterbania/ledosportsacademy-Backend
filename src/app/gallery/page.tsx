"use client";

import { useState } from 'react';
import Image from "next/image"
import { getAllPhotos, Photo } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function GalleryPage() {
  const photos = getAllPhotos()
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleDialogClose = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
    <Header />
    <div className="container py-8 md:py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Photo Gallery</h1>
        <p className="mt-4 text-lg text-muted-foreground">A collection of moments from our club's journey.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo, index) => (
          <Dialog key={photo.id} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
             <DialogTrigger asChild>
                <Card 
                  className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in cursor-pointer" 
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={photo.url}
                        alt={`Gallery photo ${photo.id}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        data-ai-hint={photo['data-ai-hint']}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white font-bold text-lg">View</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
             </DialogTrigger>
             {selectedPhoto && selectedPhoto.id === photo.id && (
                <DialogContent className="p-0 border-0 max-w-4xl bg-transparent">
                     <DialogTitle className="sr-only">{`Enlarged view of gallery photo ${selectedPhoto.id}`}</DialogTitle>
                     <DialogDescription className="sr-only">
                        A larger view of the selected photo from the gallery.
                     </DialogDescription>
                    <Image
                        src={selectedPhoto.url}
                        alt={`Gallery photo ${selectedPhoto.id}`}
                        width={1200}
                        height={800}
                        className="object-contain w-full h-auto rounded-lg"
                    />
                </DialogContent>
             )}
          </Dialog>
        ))}
      </div>
    </div>
    </>
  )
}
