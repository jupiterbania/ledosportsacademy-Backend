import { HomepageSlideshow } from "@/components/homepage-slideshow";
import { RecentPhotos } from "@/components/recent-photos";
import { UpcomingEvents } from "@/components/upcoming-events";

export default function Home() {
  return (
    <div className="flex flex-col animate-fade-in">
      <HomepageSlideshow />
      <div className="container py-8 md:py-12 space-y-12">
        <UpcomingEvents />
        <RecentPhotos />
      </div>
    </div>
  );
}
