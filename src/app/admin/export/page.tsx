
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { 
  getAllDonations, Donation,
  getAllCollections, Collection,
  getAllExpenses, Expense
} from "@/lib/data";

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDFWithAutoTable;
}


export default function ExportPage() {
  const { toast } = useToast();

  const generatePdf = async (dataType: string) => {
    toast({
      title: "Export Initiated",
      description: `Generating PDF for ${dataType}. Please wait...`,
    });

    const doc = new jsPDF() as jsPDFWithAutoTable;
    const date = new Date().toLocaleDateString();

    try {
        let data, columns, body;
        
        const commonHeader = (doc: jsPDFWithAutoTable, title: string) => {
            doc.setFontSize(18);
            doc.text(title, 14, 22);
            doc.setFontSize(11);
            doc.text(`Report generated on: ${date}`, 14, 30);
        };

        switch (dataType) {
            case 'Donations':
                data = await getAllDonations();
                columns = ["Date", "Title", "Donor", "Description", "Value"];
                body = data.map((d: Donation) => [
                    new Date(d.date).toLocaleDateString(),
                    d.title,
                    d.donorName || 'N/A',
                    d.description || 'N/A',
                    d.amount ? `INR ${new Intl.NumberFormat('en-IN').format(d.amount)}` : d.item || 'N/A'
                ]);
                commonHeader(doc, "Donations Report");
                break;
            case 'Collections':
                data = await getAllCollections();
                columns = ["Date", "Title", "Amount"];
                body = data.map((c: Collection) => [
                    new Date(c.date).toLocaleDate-String(),
                    c.title,
                    `INR ${new Intl.NumberFormat('en-IN').format(c.amount)}`
                ]);
                commonHeader(doc, "Collections Report");
                break;
            case 'Expenses':
                data = await getAllExpenses();
                columns = ["Date", "Title", "Amount"];
                body = data.map((e: Expense) => [
                     new Date(e.date).toLocaleDateString(),
                    e.title,
                    `INR ${new Intl.NumberFormat('en-IN').format(e.amount)}`
                ]);
                 commonHeader(doc, "Expenses Report");
                break;
            default:
                toast({ title: "Error", description: "Invalid data type for export.", variant: "destructive"});
                return;
        }

        doc.autoTable({
            startY: 40,
            head: [columns],
            body: body,
            theme: 'striped',
            headStyles: { fillColor: [22, 163, 74] }, // Green
        });

        doc.save(`${dataType.toLowerCase()}_report_${Date.now()}.pdf`);
        toast({ title: "Export Successful", description: `${dataType} PDF has been downloaded.` });

    } catch (error) {
        console.error("PDF generation failed: ", error);
        toast({ title: "Export Failed", description: "Could not generate the PDF.", variant: "destructive" });
    }
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>PDF Export</CardTitle>
           <CardDescription>Export your club data to PDF format.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Select the data you would like to export. Clicking a button will start the PDF download.</p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => generatePdf('Donations')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Donations
            </Button>
            <Button onClick={() => generatePdf('Collections')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Collections
            </Button>
            <Button onClick={() => generatePdf('Expenses')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Expenses
            </Button>
            <Button onClick={() => { toast({ title: "Coming Soon", description: "Full analytics export is under development."})}}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Full Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

