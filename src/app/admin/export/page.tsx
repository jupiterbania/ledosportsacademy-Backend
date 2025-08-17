import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export default function ExportPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>PDF Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Export your club data to PDF format.</p>
          <div className="flex flex-wrap gap-4">
            <Button>
              <FileDown className="mr-2 h-4 w-4" />
              Export Donations
            </Button>
            <Button>
              <FileDown className="mr-2 h-4 w-4" />
              Export Collections
            </Button>
            <Button>
              <FileDown className="mr-2 h-4 w-4" />
              Export Expenses
            </Button>
            <Button>
              <FileDown className="mr-2 h-4 w-4" />
              Export Full Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
