
"use client";

import { useState, useEffect } from 'react';
import Image from "next/image"
import { getAllPhotos, Photo } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const data = await getAllPhotos();
      setPhotos(data);
    }
    fetchPhotos();
  }, []);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleDialogClose = () => {
    setSelectedPhoto(null);
  };

  return (
    
    <div className="container py-8 md:py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Photo Gallery</h1>
        <p className="mt-4 text-lg text-muted-foreground">A collection of moments from our club's journey.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
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
                        alt={photo.title || `Gallery photo ${photo.id}`}
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
                    <DialogTitle className="sr-only">{selectedPhoto.title || `Enlarged view of gallery photo ${selectedPhoto.id}`}</DialogTitle>
                    <div className="relative">
                        <Image
                            src={selectedPhoto.url}
                            alt={selectedPhoto.title || `Gallery photo ${selectedPhoto.id}`}
                            width={1200}
                            height={800}
                            className="object-contain w-full h-auto rounded-lg"
                        />
                        {(selectedPhoto.title || selectedPhoto.description) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 text-white rounded-b-lg">
                                {selectedPhoto.title && <h3 className="text-xl font-bold">{selectedPhoto.title}</h3>}
                                {selectedPhoto.description && <DialogDescription className="text-white/90 mt-1">{selectedPhoto.description}</DialogDescription>}
                            </div>
                        )}
                    </div>
                </DialogContent>
             )}
          </Dialog>
        ))}
      </div>
    </div>
    
  )
}
