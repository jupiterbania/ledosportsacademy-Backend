"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileDown } from "lucide-react";

export default function ExportPage() {
  const { toast } = useToast();

  const handleExport = (dataType: string) => {
    toast({
      title: "Export Initiated",
      description: `Generating PDF for ${dataType}. This feature is coming soon!`,
    });
    // Placeholder for actual PDF generation logic
    console.log(`Exporting ${dataType}...`);
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>PDF Export</CardTitle>
           <CardDescription>Export your club data to PDF format. This feature is currently under development.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Select the data you would like to export. Clicking a button will simulate the start of a PDF download.</p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => handleExport('Donations')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Donations
            </Button>
            <Button onClick={() => handleExport('Collections')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Collections
            </Button>
            <Button onClick={() => handleExport('Expenses')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Expenses
            </Button>
            <Button onClick={() => handleExport('Full Analytics')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Full Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
