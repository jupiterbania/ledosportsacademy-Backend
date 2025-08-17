import { Header } from "@/components/layout/header";
import { HomepageSlideshow } from "@/components/homepage-slideshow";
import { RecentPhotos } from "@/components/recent-photos";
import { RecentEvents } from "@/components/recent-events";
import { RecentAchievements } from "@/components/recent-achievements";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col animate-fade-in">
        <HomepageSlideshow />
        <div className="container py-8 md:py-12 space-y-12">
          <RecentEvents />
          <RecentAchievements />
          <RecentPhotos />
        </div>
      </div>
    </>
  );
}
