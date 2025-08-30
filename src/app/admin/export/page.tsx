
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
  getAllExpenses, Expense,
  getAllMembers, Member,
  getAllEvents, Event,
  getAllAchievements, Achievement
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
                    d.amount ? `Rs ${new Intl.NumberFormat('en-IN').format(d.amount)}` : d.item || 'N/A'
                ]);
                commonHeader(doc, "Donations Report");
                break;
            case 'Collections':
                data = await getAllCollections();
                columns = ["Date", "Title", "Amount"];
                body = data.map((c: Collection) => [
                    new Date(c.date).toLocaleDateString(),
                    c.title,
                    `Rs ${new Intl.NumberFormat('en-IN').format(c.amount)}`
                ]);
                commonHeader(doc, "Collections Report");
                break;
            case 'Expenses':
                data = await getAllExpenses();
                columns = ["Date", "Title", "Amount"];
                body = data.map((e: Expense) => [
                     new Date(e.date).toLocaleDateString(),
                    e.title,
                    `Rs ${new Intl.NumberFormat('en-IN').format(e.amount)}`
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

  const generateFullAnalyticsPdf = async () => {
    toast({
      title: "Full Analytics Export Initiated",
      description: "Generating comprehensive PDF report. This may take a moment...",
    });

    const doc = new jsPDF() as jsPDFWithAutoTable;
    const date = new Date().toLocaleDateString();

    try {
      // Main Title
      doc.setFontSize(22);
      doc.text("LEDO SPORTS ACADEMY - Full Analytics Report", 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated on: ${date}`, 105, 28, { align: 'center' });

      const [donations, collections, expenses, members, events, achievements] = await Promise.all([
        getAllDonations(),
        getAllCollections(),
        getAllExpenses(),
        getAllMembers(),
        getAllEvents(),
        getAllAchievements()
      ]);
      
      let startY = 40;

      const addSection = (title: string, head: any[], body: any[][], newPage: boolean = true) => {
          if (newPage && doc.internal.pageSize.height - startY < 60) {
            doc.addPage();
            startY = 20;
          }
          doc.setFontSize(16);
          doc.text(title, 14, startY);
          startY += 8;

          doc.autoTable({
              head: head,
              body: body,
              startY: startY,
              theme: 'striped',
              headStyles: { fillColor: '#16a34a' },
          });
          startY = doc.autoTable.previous.finalY + 15;
      }
      
      // Financial Summary
      const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
      const totalCollections = collections.reduce((sum, c) => sum + c.amount, 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const netBalance = totalDonations + totalCollections - totalExpenses;
      
      const financialSummaryBody = [
        ['Total Donations', `Rs ${new Intl.NumberFormat('en-IN').format(totalDonations)}`],
        ['Total Collections', `Rs ${new Intl.NumberFormat('en-IN').format(totalCollections)}`],
        ['Total Income', `Rs ${new Intl.NumberFormat('en-IN').format(totalDonations + totalCollections)}`],
        ['Total Expenses', `Rs ${new Intl.NumberFormat('en-IN').format(totalExpenses)}`],
        ['Net Balance', `Rs ${new Intl.NumberFormat('en-IN').format(netBalance)}`],
      ];

      addSection("Financial Summary", [["Metric", "Amount"]], financialSummaryBody, false);


      // Donations
      addSection(
        "Donations",
        [["Date", "Title", "Donor", "Description", "Value"]],
        donations.map(d => [new Date(d.date).toLocaleDateString(), d.title, d.donorName || 'N/A', d.description || 'N/A', d.amount ? `Rs ${new Intl.NumberFormat('en-IN').format(d.amount)}` : d.item || 'N/A'])
      );

      // Collections
      addSection(
        "Collections",
        [["Date", "Title", "Amount"]],
        collections.map(c => [new Date(c.date).toLocaleDateString(), c.title, `Rs ${new Intl.NumberFormat('en-IN').format(c.amount)}`])
      );
      
      // Expenses
      addSection(
        "Expenses",
        [["Date", "Title", "Amount"]],
        expenses.map(e => [new Date(e.date).toLocaleDateString(), e.title, `Rs ${new Intl.NumberFormat('en-IN').format(e.amount)}`])
      );
      
      // Members
      addSection(
        "Members",
        [["Join Date", "Name", "Email"]],
        members.map(m => [new Date(m.joinDate).toLocaleDateString(), m.name, m.email])
      );

      // Events
      addSection(
        "Events",
        [["Date", "Title", "Description"]],
        events.map(e => [new Date(e.date).toLocaleDateString(), e.title, e.description])
      );

      // Achievements
      addSection(
        "Achievements",
        [["Date", "Title", "Description"]],
        achievements.map(a => [new Date(a.date).toLocaleDateString(), a.title, a.description])
      );


      doc.save(`full_analytics_report_${Date.now()}.pdf`);
      toast({ title: "Export Successful", description: "Full analytics PDF has been downloaded." });

    } catch (error) {
      console.error("Full analytics PDF generation failed: ", error);
      toast({ title: "Export Failed", description: "Could not generate the full analytics PDF.", variant: "destructive" });
    }
  };


  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
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
            <Button onClick={generateFullAnalyticsPdf}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Full Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
