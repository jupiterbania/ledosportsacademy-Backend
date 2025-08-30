
"use client";

import Link from "next/link"
import Image from "next/image"
import { Photo } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RecentPhotos({ photos }: { photos: Photo[] }) {
  if (!photos || photos.length === 0) {
    return null;
  }
  
  return (
    <section className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold aurora-text-gradient">Recent in Gallery</h2>
        <Button asChild variant="link" className="text-cyan-300 hover:text-cyan-200">
          <Link href="/gallery">
            View All
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {photos.map((photo, index) => (
          <Link key={photo.id} href="/gallery" className="block group">
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1.5 h-full flex flex-col border-2 border-transparent hover:border-primary/50 animate-fade-in aurora-card" style={{ animationDelay: `${index * 150}ms` }}>
              <CardContent className="p-0">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.title || `Gallery photo ${photo.id}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />
                </div>
              </CardContent>
               {(photo.title || photo.description) && (
                <div className="p-4 flex-grow flex flex-col">
                  {photo.title && <h3 className="font-bold text-lg aurora-text-gradient group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)] transition-all duration-300">{photo.title}</h3>}
                  {photo.description && <p className="text-sm text-muted-foreground mt-1 flex-grow">{photo.description}</p>}
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
