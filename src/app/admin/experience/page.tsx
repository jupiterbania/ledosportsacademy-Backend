import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExperiencePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Experience Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your club's experience and achievements here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
