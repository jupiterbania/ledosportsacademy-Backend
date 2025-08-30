
"use client";

import { useState, useEffect } from 'react';
import { HomepageSlideshow } from "@/components/homepage-slideshow";
import { getRecentEvents, getRecentAchievements, getRecentPhotos, Event, Achievement, Photo } from "@/lib/data";
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecentEvents } from '@/components/recent-events';

const SectionSeparator = () => (
   <div className="my-16 md:my-24 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
);

const Section = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <section className={`container mx-auto px-4 py-8 md:py-12 animate-fade-in ${className || ''}`} {...props} />
);

const WelcomeSection = () => (
  <Section>
    <Card className="aurora-card p-8 md:p-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold aurora-text-gradient mb-4">Welcome to LEDO SPORTS ACADEMY</h2>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
        A community-driven organization dedicated to fostering talent, promoting sportsmanship, and building a brighter future through sports.
      </p>
    </Card>
  </Section>
);

const FocusSection = () => {
    const focusItems = [
        {
            title: "Community Building",
            description: "Creating a strong, supportive network for all our members, fostering teamwork and collaboration.",
        },
        {
            title: "Youth Development",
            description: "Nurturing the next generation of athletes with top-tier coaching and mentorship programs.",
        },
        {
            title: "Competitive Excellence",
            description: "Striving for victory and celebrating our achievements on and off the field.",
        }
    ];

    return (
        <Section>
             <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold aurora-text-gradient">Our Focus</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                 {focusItems.map((item, index) => (
                    <Card key={index} className="aurora-card text-center p-6 flex flex-col items-center transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                         <div className="mb-4 text-primary bg-gradient-to-br from-primary/20 to-primary/5 rounded-full p-4 ring-2 ring-primary/30 aurora-glow">
                        </div>
                        <CardTitle className="mb-2 text-xl">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                    </Card>
                ))}
            </div>
        </Section>
    )
};


const FeaturedAchievementSection = ({ achievements }: { achievements: Achievement[] }) => {
  const featured = achievements[0];
  if (!featured) return null;

  return (
      <Section>
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold aurora-text-gradient">Latest Triumph</h2>
          </div>
          <Card className="grid md:grid-cols-2 overflow-hidden aurora-card transition-all duration-300 hover:shadow-cyan-500/20 hover:border-primary/50 border-2 border-transparent">
              <div className="relative min-h-[300px] md:min-h-full">
                  <Image
                      src={featured.photoUrl}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                  />
                   <div className="absolute inset-0 bg-black/40" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <span>{new Date(featured.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <CardTitle className="text-3xl mb-4">{featured.title}</CardTitle>
                  <CardDescription className="text-base">{featured.description}</CardDescription>
                   <Button asChild variant="link" className="text-cyan-300 hover:text-cyan-200 justify-start p-0 mt-4">
                      <Link href="/member/achievements">
                        View All Achievements
                      </Link>
                    </Button>
              </div>
          </Card>
      </Section>
  )
}

const GalleryPreviewSection = ({ photos }: { photos: Photo[] }) => {
    if(!photos || photos.length === 0) return null;

    return (
        <Section>
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold aurora-text-gradient">From Our Gallery</h2>
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.slice(0, 4).map((photo, index) => (
                    <Link key={photo.id} href="/gallery" className="block group">
                        <Card className="overflow-hidden relative group aspect-square transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1.5 animate-fade-in aurora-card" style={{ animationDelay: `${index * 150}ms` }}>
                             <Image
                                src={photo.url}
                                alt={photo.title || "Gallery photo"}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                        </Card>
                    </Link>
                ))}
            </div>
             <div className="text-center mt-8">
                 <Button asChild size="lg">
                    <Link href="/gallery">
                        Explore Full Gallery
                    </Link>
                </Button>
            </div>
        </Section>
    )
}

const EventsCTASection = () => (
    <Section>
        <Card className="aurora-card text-center p-8 md:p-12 bg-gradient-to-r from-primary/10 via-cyan-500/10 to-blue-500/10">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Next Event</h2>
             <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Stay active, meet new people, and be a part of our vibrant community. Check out what's coming up!
            </p>
             <Button asChild size="lg">
                <Link href="/events">
                    View Upcoming Events
                </Link>
            </Button>
        </Card>
    </Section>
)


export default function Home() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setRecentEvents(await getRecentEvents(2));
      setRecentAchievements(await getRecentAchievements(1));
      setRecentPhotos(await getRecentPhotos(4));
    };
    fetchData();
  }, []);

  return (
      <div className="flex flex-col">
        <HomepageSlideshow />
        <WelcomeSection />
        <SectionSeparator />
        <FocusSection />
        <SectionSeparator />
        <FeaturedAchievementSection achievements={recentAchievements} />
        <SectionSeparator />
        <RecentEvents events={recentEvents} />
        <SectionSeparator />
        <GalleryPreviewSection photos={recentPhotos} />
        <SectionSeparator />
        <EventsCTASection />
      </div>
  );
}
