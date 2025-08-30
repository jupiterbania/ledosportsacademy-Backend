
"use client";

import Link from "next/link"
import Image from "next/image"
import { Event } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

export function RecentEvents({ events }: { events: Event[] }) {
  if (!events || events.length === 0) {
    return null;
  }

  const EventCardContent = ({ event, index }: { event: Event, index: number }) => (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1.5 h-full flex flex-col border-2 border-transparent hover:border-primary/50 animate-fade-in aurora-card" style={{ animationDelay: `${index * 150}ms` }}>
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={event.photoUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          data-ai-hint={event['data-ai-hint']}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />
      </div>
      <CardHeader>
        <CardTitle className="aurora-text-gradient group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)] transition-all duration-300">{event.title}</CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground text-sm pt-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{event.description}</CardDescription>
      </CardContent>
    </Card>
  );

  return (
    <section className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold aurora-text-gradient">Recent Events</h2>
        <Button asChild variant="link" className="text-cyan-300 hover:text-cyan-200">
          <Link href="/events">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {events.map((event, index) => {
          const href = event.redirectUrl || "/events";
          const target = event.redirectUrl ? "_blank" : undefined;
          const rel = event.redirectUrl ? "noopener noreferrer" : undefined;

          return (
            <Link key={event.id} href={href} target={target} rel={rel} className="block group">
              <EventCardContent event={event} index={index} />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
