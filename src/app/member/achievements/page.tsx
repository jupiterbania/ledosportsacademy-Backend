"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllAchievements } from "@/lib/data";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineContent,
} from "@/components/ui/timeline";
import { Medal } from 'lucide-react';
import Image from 'next/image';

export default function MemberAchievementsPage() {
  const achievements = useMemo(() => getAllAchievements(), []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Club Achievements</CardTitle>
          <CardDescription>A timeline of our major milestones and victories. (View-only)</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-8">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="overflow-hidden">
             <div className="relative aspect-video w-full">
                <Image
                  src={achievement.photoUrl}
                  alt={achievement.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  data-ai-hint={achievement['data-ai-hint']}
                />
              </div>
            <CardHeader>
              <CardTitle>{achievement.title}</CardTitle>
               <div className="flex items-center gap-2 text-muted-foreground text-sm pt-2">
                  <Medal className="w-4 h-4" />
                  <span>{new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </CardHeader>
            <CardContent>
              <p>{achievement.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
