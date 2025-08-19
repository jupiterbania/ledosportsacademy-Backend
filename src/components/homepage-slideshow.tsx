
"use client"

import * as React from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { getSlideshowItems, SlideshowItem } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"

export function HomepageSlideshow() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0);
  const [slideshowItems, setSlideshowItems] = React.useState<SlideshowItem[]>([]);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  React.useEffect(() => {
    const fetchItems = async () => {
        const items = await getSlideshowItems();
        setSlideshowItems(items);
    }
    fetchItems();
  }, []);

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap());

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", handleSelect);

    return () => {
        api.off("select", handleSelect);
    }
  }, [api])

  if (slideshowItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full relative">
      <Carousel 
        setApi={setApi} 
        className="w-full" 
        opts={{ loop: true }}
        plugins={[plugin.current]}
       >
        <CarouselContent>
          {slideshowItems.map((item, index) => (
            <CarouselItem key={item.id}>
              <Card className="border-none rounded-none">
                <CardContent className="p-0">
                  <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
                    <Image
                      src={item.url}
                      alt={item.description || item.title || `Slider item ${item.id}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      data-ai-hint={item['data-ai-hint']}
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-background/50 hover:bg-background/80" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-background/50 hover:bg-background/80" />
      </Carousel>
       <div className="absolute bottom-10 left-0 right-0 text-center w-full z-10 px-4">
            {slideshowItems[current]?.title && (
              <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">{slideshowItems[current]?.title}</h1>
            )}
            {slideshowItems[current]?.description && (
                 <p className="text-white/90 text-lg md:text-xl mt-2 drop-shadow-md transition-opacity duration-500 ease-in-out">
                    {slideshowItems[current].description}
                </p>
            )}
        </div>
    </section>
  )
}
