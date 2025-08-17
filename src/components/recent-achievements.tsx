import Link from "next/link"
import Image from "next/image"
import { Achievement } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Medal, ArrowRight } from "lucide-react"

export function RecentAchievements({ achievements }: { achievements: Achievement[] }) {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Recent Achievements</h2>
        <Button asChild variant="link" className="text-primary">
          <Link href="/admin/achievements">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Link key={achievement.id} href="/admin/achievements" className="block group">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 h-full flex flex-col border-2 border-transparent hover:border-primary">
              <div className="relative aspect-video w-full">
                <Image
                  src={achievement.photoUrl}
                  alt={achievement.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  data-ai-hint={achievement['data-ai-hint']}
                />
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{achievement.title}</CardTitle>
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
