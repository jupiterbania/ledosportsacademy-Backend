
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/20 hover:bg-white/40 text-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/20 hover:bg-white/40 text-white" />
      </Carousel>
       <div className="absolute bottom-10 sm:bottom-20 left-4 sm:left-10 md:left-20 right-4 sm:right-10 md:right-20 z-10 px-4 text-left">
            <div key={current} className="animate-in fade-in-0 slide-in-from-bottom-10 duration-700">
                {slideshowItems[current]?.title && (
                  <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-2xl">{slideshowItems[current]?.title}</h1>
                )}
                {slideshowItems[current]?.description && (
                     <p className="text-white/90 text-base md:text-lg max-w-2xl mt-2 drop-shadow-lg">
                        {slideshowItems[current].description}
                    </p>
                )}
            </div>
        </div>
    </section>
  )
}
