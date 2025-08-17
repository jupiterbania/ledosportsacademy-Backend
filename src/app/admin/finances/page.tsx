import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinancesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Finances</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage donations, collections, and expenses here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
