
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

const getBase64Image = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


export default function ExportPage() {
  const { toast } = useToast();
  const logoUrl = 'https://iili.io/KFtnPMg.png';

  const generatePdf = async (dataType: string) => {
    toast({
      title: "Export Initiated",
      description: `Generating PDF for ${dataType}. Please wait...`,
    });

    try {
        const doc = new jsPDF() as jsPDFWithAutoTable;
        const date = new Date().toLocaleDateString();
        const logoBase64 = await getBase64Image(logoUrl);
        
        let data, columns, body;
        
        const commonHeader = (doc: jsPDFWithAutoTable, title: string) => {
            doc.addImage(logoBase64, 'PNG', 14, 15, 20, 20);
            doc.setFontSize(18);
            doc.text(title, 40, 22);
            doc.setFontSize(11);
            doc.text(`Report generated on: ${date}`, 40, 30);
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

    try {
        const doc = new jsPDF() as jsPDFWithAutoTable;
        const date = new Date().toLocaleDateString();
        const logoBase64 = await getBase64Image(logoUrl);

      // Main Title
      doc.addImage(logoBase64, 'PNG', 14, 15, 20, 20);
      doc.setFontSize(22);
      doc.text("Admin", 105, 25, { align: 'center' });
      doc.setFontSize(16);
      doc.text("Full Analytics Report", 105, 33, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated on: ${date}`, 105, 40, { align: 'center' });

      const [donations, collections, expenses, members, events, achievements] = await Promise.all([
        getAllDonations(),
        getAllCollections(),
        getAllExpenses(),
        getAllMembers(),
        getAllEvents(),
        getAllAchievements()
      ]);
      
      let startY = 55;

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
      const monetaryDonations = donations.filter(d => typeof d.amount === 'number');
      const totalDonations = monetaryDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
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
              Export Donations
            </Button>
            <Button onClick={() => generatePdf('Collections')}>
              Export Collections
            </Button>
            <Button onClick={() => generatePdf('Expenses')}>
              Export Expenses
            </Button>
            <Button onClick={generateFullAnalyticsPdf}>
              Export Full Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
