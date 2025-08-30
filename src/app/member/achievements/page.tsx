
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllAchievements, Achievement } from "@/lib/data";
import Image from 'next/image';

export default function MemberAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const data = await getAllAchievements();
      setAchievements(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };
    fetchAchievements();
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Club Achievements</CardTitle>
          <CardDescription>A timeline of our major milestones and victories. (View-only)</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        {achievements.map((achievement, index) => (
          <Card key={achievement.id} className="overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
             <div className="relative aspect-video w-full">
                <Image
                  src={achievement.photoUrl}
                  alt={achievement.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  
                />
              </div>
            <CardHeader>
              <CardTitle>{achievement.title}</CardTitle>
               <div className="flex items-center gap-2 text-muted-foreground text-sm pt-2">
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
