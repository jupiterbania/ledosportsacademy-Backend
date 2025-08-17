
"use client";

import { useState, useEffect } from 'react';
import { HomepageSlideshow } from "@/components/homepage-slideshow";
import { RecentPhotos } from "@/components/recent-photos";
import { RecentEvents } from "@/components/recent-events";
import { RecentAchievements } from "@/components/recent-achievements";
import { getRecentEvents, getRecentAchievements, getRecentPhotos, Event, Achievement, Photo } from "@/lib/data";

export default function Home() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setRecentEvents(await getRecentEvents());
      setRecentAchievements(await getRecentAchievements());
      setRecentPhotos(await getRecentPhotos());
    };
    fetchData();
  }, []);


  return (
    
      <div className="flex flex-col animate-fade-in">
        <HomepageSlideshow />
        <div className="container py-8 md:py-12 space-y-12">
          <RecentEvents events={recentEvents} />
          <RecentAchievements achievements={recentAchievements} />
          <RecentPhotos photos={recentPhotos} />
        </div>
      </div>
    
  );
}
