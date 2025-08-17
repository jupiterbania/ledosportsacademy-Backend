import { Header } from "@/components/layout/header";
import { HomepageSlideshow } from "@/components/homepage-slideshow";
import { RecentPhotos } from "@/components/recent-photos";
import { RecentEvents } from "@/components/recent-events";
import { RecentAchievements } from "@/components/recent-achievements";
import { getRecentEvents, getRecentAchievements, getRecentPhotos } from "@/lib/data";

export default async function Home() {
  const recentEvents = await getRecentEvents();
  const recentAchievements = await getRecentAchievements();
  const recentPhotos = await getRecentPhotos();

  return (
    <>
      <Header />
      <div className="flex flex-col animate-fade-in">
        <HomepageSlideshow />
        <div className="container py-8 md:py-12 space-y-12">
          <RecentEvents events={recentEvents} />
          <RecentAchievements achievements={recentAchievements} />
          <RecentPhotos photos={recentPhotos} />
        </div>
      </div>
    </>
  );
}
