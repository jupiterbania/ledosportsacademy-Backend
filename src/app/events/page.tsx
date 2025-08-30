
"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { getAllEvents, Event } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getAllEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const EventCard = ({ event, index }: { event: Event, index: number }) => (
    <Card key={event.id} className="group overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1.5 flex flex-col border-2 border-transparent hover:border-primary/50 animate-fade-in aurora-card" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={event.photoUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
      </div>
      <CardHeader>
        <CardTitle className="aurora-text-gradient group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)] transition-all duration-300">{event.title}</CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground text-sm pt-2">
          <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{event.description}</CardDescription>
      </CardContent>
    </Card>
  );

  return (
    
    <div className="container py-8 md:py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl aurora-text-gradient">Club Events</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">Join us for our upcoming activities and gatherings. Discover what's next on our agenda.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          event.redirectUrl ? (
            <Link key={event.id} href={event.redirectUrl} target="_blank" rel="noopener noreferrer" className="block">
              <EventCard event={event} index={index} />
            </Link>
          ) : (
            <EventCard key={event.id} event={event} index={index} />
          )
        ))}
      </div>
    </div>
    
  )
}
