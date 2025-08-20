
"use client"

import * as React from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { getSlideshowItems, SlideshowItem } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function HomepageSlideshow() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0);
  const [slideshowItems, setSlideshowItems] = React.useState<SlideshowItem[]>([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);

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

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setIsDescriptionExpanded(false); // Reset on slide change
    };
    
    api.on("select", handleSelect);

    return () => {
        api.off("select", handleSelect);
    }
  }, [api])

  const scrollTo = React.useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  if (slideshowItems.length === 0) {
    return null;
  }
  
  const currentItem = slideshowItems[current];

  return (
    <section className="w-full py-6 md:py-8 lg:py-12">
      <div className="container">
        <Carousel 
          setApi={setApi} 
          className="w-full group rounded-xl overflow-hidden shadow-2xl border" 
          opts={{ loop: true }}
          plugins={[plugin.current]}
        >
          <CarouselContent>
            {slideshowItems.map((item, index) => (
              <CarouselItem key={item.id}>
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/20 hover:bg-white/40 text-white" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/20 hover:bg-white/40 text-white" />
          
           <div className="absolute bottom-10 sm:bottom-16 md:bottom-20 left-0 right-0 z-10 px-4 sm:px-8 md:px-16 text-left">
              <div key={current} className="max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-bottom-10 duration-700">
                  {currentItem?.title && (
                    <h1 className="text-white text-xl md:text-3xl lg:text-4xl font-bold drop-shadow-2xl line-clamp-2">{currentItem.title}</h1>
                  )}
                  {currentItem?.description && (
                       <div>
                         <p className={cn(
                           "text-white/90 text-sm md:text-base max-w-2xl mt-2 drop-shadow-lg transition-all duration-300",
                           !isDescriptionExpanded && "line-clamp-1"
                         )}>
                            {currentItem.description}
                        </p>
                        {currentItem.description.length > 80 && ( // Rough estimate for 1 line
                           <Button 
                              variant="link" 
                              className="p-0 mt-1 text-white/90 hover:text-white text-sm md:text-base"
                              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            >
                              {isDescriptionExpanded ? "Show Less" : "Read More"}
                           </Button>
                        )}
                       </div>
                  )}
              </div>
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
            {slideshowItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-2 w-2 rounded-full bg-white/50 transition-all",
                  "hover:bg-white/80 hover:scale-110",
                  current === index ? "w-4 bg-white" : "bg-white/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </Carousel>
      </div>
    </section>
  )
}
