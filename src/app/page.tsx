
"use client";

import { useState, useEffect } from 'react';
import { HomepageSlideshow } from "@/components/homepage-slideshow";
import { RecentPhotos } from "@/components/recent-photos";
import { RecentEvents } from "@/components/recent-events";
import { RecentAchievements } from "@/components/recent-achievements";
import { getRecentEvents, getRecentAchievements, getRecentPhotos, Event, Achievement, Photo } from "@/lib/data";
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setRecentEvents(await getRecentEvents(3));
      setRecentAchievements(await getRecentAchievements(3));
      setRecentPhotos(await getRecentPhotos(3));
    };
    fetchData();
  }, []);

  const SectionSeparator = () => (
     <div className="my-12 md:my-24 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
  );

  return (
    
      <div className="flex flex-col">
        <HomepageSlideshow />
        <div className="container py-12 md:py-16 lg:py-20 space-y-16 md:space-y-20 lg:space-y-24">
          <RecentEvents events={recentEvents} />
          <SectionSeparator />
          <RecentAchievements achievements={recentAchievements} />
          <SectionSeparator />
          <RecentPhotos photos={recentPhotos} />
        </div>
      </div>
    
  );
}
