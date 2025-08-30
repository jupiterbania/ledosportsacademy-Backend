
"use client"

import * as React from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { getSlideshowItems, SlideshowItem } from "@/lib/data"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function HomepageSlideshow() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0);
  const [slideshowItems, setSlideshowItems] = React.useState<SlideshowItem[]>([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
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
    return <div className="h-[60vh] w-full flex items-center justify-center text-muted-foreground">Loading Slideshow...</div>;
  }
  
  const currentItem = slideshowItems[current];

  return (
    <section className="w-full relative">
       <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-b from-cyan-500/20 via-background to-background" />
      <Carousel 
        setApi={setApi} 
        className="w-full group" 
        opts={{ loop: true }}
        plugins={[plugin.current]}
      >
        <CarouselContent>
          {slideshowItems.map((item, index) => (
            <CarouselItem key={item.id}>
                <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[70vh] w-full">
                  <Image
                    src={item.url}
                    alt={item.description || item.title || `Slider item ${item.id}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint={item['data-ai-hint']}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <CarouselPrevious className="relative left-0 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm" />
              <CarouselNext className="relative right-0 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm" />
            </div>
        </div>
        
         <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-8 md:p-12 text-center bg-gradient-to-t from-background via-background/80 to-transparent">
            <div key={current} className="max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-bottom-10 duration-700">
                {currentItem?.title && (
                  <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-[0_2px_10px_hsl(var(--primary)/0.5)] aurora-text-gradient line-clamp-2">{currentItem.title}</h1>
                )}
                {currentItem?.description && (
                     <div>
                       <p className={cn(
                         "text-white/80 text-sm md:text-base max-w-2xl mt-4 drop-shadow-lg transition-all duration-300 mx-auto",
                         !isDescriptionExpanded && "line-clamp-1"
                       )}>
                          {currentItem.description}
                      </p>
                      {currentItem.description.length > 80 && ( // Rough estimate for 1 line
                         <Button 
                            variant="link" 
                            className="p-0 mt-1 text-cyan-300 hover:text-cyan-200 text-sm md:text-base"
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
                "h-2 w-2 rounded-full bg-white/30 transition-all duration-300 backdrop-blur-sm",
                "hover:bg-white/50 hover:scale-110",
                current === index ? "w-6 bg-cyan-400" : "bg-white/30"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </Carousel>
    </section>
  )
}
