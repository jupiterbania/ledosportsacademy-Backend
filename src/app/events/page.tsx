import Image from "next/image"
import { getAllEvents } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { Header } from "@/components/layout/header"

export const metadata = {
  title: "Events | Club Central",
};

export default function EventsPage() {
  const events = getAllEvents()

  return (
    <>
    <Header />
    <div className="container py-8 md:py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Club Events</h1>
        <p className="mt-4 text-lg text-muted-foreground">Join us for our upcoming activities and gatherings.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <Card key={event.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col border-2 border-transparent hover:border-primary animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative aspect-video w-full">
              <Image
                src={event.photoUrl}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                data-ai-hint={event['data-ai-hint']}
              />
            </div>
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">{event.title}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground text-sm pt-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{event.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </>
  )
}
