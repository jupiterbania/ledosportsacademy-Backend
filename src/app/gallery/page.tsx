
"use client";

import { useState, useEffect } from 'react';
import Image from "next/image"
import { getAllPhotos, Photo } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Eye, Download } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const logoUrl = 'https://iili.io/KFtnPMg.png';

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

  const loadImg = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
  }

  const handleDownload = async (photo: Photo, quality: 'high' | 'medium' | 'low') => {
    toast({ title: "Preparing Download", description: `Downloading ${photo.title || 'image'} in ${quality} quality...` });

    try {
        const [mainImage, logoImage] = await Promise.all([
            loadImg(photo.url),
            loadImg(logoUrl)
        ]);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        let scale = 1;
        if (quality === 'medium') scale = 0.5;
        if (quality === 'low') scale = 0.25;

        const canvasWidth = mainImage.width * scale;
        const canvasHeight = mainImage.height * scale;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Draw main image
        ctx.drawImage(mainImage, 0, 0, canvasWidth, canvasHeight);

        // Draw watermark
        const logoAspectRatio = logoImage.width / logoImage.height;
        let logoHeight = canvasHeight * 0.1; // Logo height is 10% of canvas height
        let logoWidth = logoHeight * logoAspectRatio;
        
        // Ensure logo is not too big
        if (logoWidth > canvasWidth * 0.3) {
            logoWidth = canvasWidth * 0.3;
            logoHeight = logoWidth / logoAspectRatio;
        }

        const padding = canvasWidth * 0.02;
        const logoX = canvasWidth - logoWidth - padding;
        const logoY = canvasHeight - logoHeight - padding;

        ctx.globalAlpha = 0.8;
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
        ctx.globalAlpha = 1.0;
        
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${photo.title || photo.id}_${quality}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast({ title: "Download Started", description: `Watermarked ${quality} quality image is downloading.` });
            }
        }, 'image/jpeg', 0.9);

    } catch (error) {
        console.error("Download failed:", error);
        toast({ title: "Download Failed", description: "Could not download the image.", variant: "destructive" });
    }
  }


  return (
    
    <div className="container py-8 md:py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl aurora-text-gradient">Photo Gallery</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">A collection of moments from our club's journey, captured in time. Explore our memories and milestones.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
        {photos.map((photo, index) => (
          <Dialog key={photo.id} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
             <DialogTrigger asChild>
                <Card 
                  className="group overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1 animate-fade-in cursor-pointer aurora-card"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={photo.url}
                        alt={photo.title || `Gallery photo ${photo.id}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="text-white w-8 h-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
             </DialogTrigger>
             {selectedPhoto && selectedPhoto.id === photo.id && (
                <DialogContent className="p-0 border-0 max-w-4xl bg-transparent shadow-none">
                    <DialogTitle className="sr-only">{selectedPhoto.title || `Enlarged view of gallery photo ${selectedPhoto.id}`}</DialogTitle>
                    <div className="relative">
                        <Image
                            src={selectedPhoto.url}
                            alt={selectedPhoto.title || `Gallery photo ${selectedPhoto.id}`}
                            width={1200}
                            height={800}
                            className="object-contain w-full h-auto rounded-lg shadow-2xl shadow-cyan-500/20"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-white rounded-b-lg flex justify-between items-end">
                            <div className='flex-1'>
                                {selectedPhoto.title && <h3 className="text-xl font-bold">{selectedPhoto.title}</h3>}
                                {selectedPhoto.description && <DialogDescription className="text-white/90 mt-1">{selectedPhoto.description}</DialogDescription>}
                            </div>
                            {user && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Download</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="aurora-card">
                                        <DropdownMenuItem onClick={() => handleDownload(selectedPhoto, 'high')}>
                                            High Quality
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDownload(selectedPhoto, 'medium')}>
                                            Medium Quality
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDownload(selectedPhoto, 'low')}>
                                            Low Quality
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </DialogContent>
             )}
          </Dialog>
        ))}
      </div>
    </div>
    
  )
}
