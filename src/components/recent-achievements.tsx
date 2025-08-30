
"use client";

import Link from "next/link"
import Image from "next/image"
import { Achievement } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Medal, ArrowRight } from "lucide-react"

export function RecentAchievements({ achievements }: { achievements: Achievement[] }) {
  if (!achievements || achievements.length === 0) {
    return null;
  }
  
  return (
    <section className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold aurora-text-gradient">Recent Achievements</h2>
        <Button asChild variant="link" className="text-cyan-300 hover:text-cyan-200">
          <Link href="/member/achievements">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <Link key={achievement.id} href="/member/achievements" className="block group">
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1.5 h-full flex flex-col border-2 border-transparent hover:border-primary/50 animate-fade-in aurora-card" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={achievement.photoUrl}
                  alt={achievement.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  data-ai-hint={achievement['data-ai-hint']}
                />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <CardHeader>
                <CardTitle className="aurora-text-gradient group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)] transition-all duration-300">{achievement.title}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground text-sm pt-2">
                  <Medal className="w-4 h-4" />
                  <span>{new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{achievement.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
