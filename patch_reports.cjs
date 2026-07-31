const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/ReportsPage.tsx', 'utf8');

code = code.replace(
  "import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';",
  "import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';\nimport jsPDF from 'jspdf';\nimport autoTable from 'jspdf-autotable';\nimport { Button } from '../../components/ui/Button';\nimport { Download } from 'lucide-react';"
);

const generatePDF = `
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text('Sales Performance Report', 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(\`Generated on: \${new Date().toLocaleDateString()}\`, 14, 28);
    
    // Summary Metrics
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text('Summary', 14, 40);
    
    doc.setFontSize(11);
    doc.text(\`Total Revenue: \${formatNaira(totalRevenue)}\`, 14, 50);
    doc.text(\`Total Transactions: \${sales.length}\`, 14, 58);
    doc.text(\`Average Sale Value: \${sales.length > 0 ? formatNaira(totalRevenue / sales.length) : formatNaira(0)}\`, 14, 66);
    
    // Daily Breakdown Table
    doc.setFontSize(14);
    doc.text('Daily Breakdown (Last 7 Days)', 14, 80);
    
    const tableData = chartData.map(data => [data.name, formatNaira(data.revenue)]);
    
    autoTable(doc, {
      startY: 85,
      head: [['Date', 'Revenue']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14 }
    });
    
    doc.save('sales_performance_report.pdf');
  };
`;

code = code.replace(
  "const chartData = Object.keys(salesByDate).slice(-7).map(date => ({",
  "const chartData = Object.keys(salesByDate).slice(-7).map(date => ({\n"
); // oops this might mess it up

code = code.replace(
  "  return (\n    <div className=\"space-y-6\">\n      <h1 className=\"text-2xl font-bold\">Reports & Analytics</h1>",
  generatePDF + "\n  return (\n    <div className=\"space-y-6\">\n      <div className=\"flex justify-between items-center\">\n        <h1 className=\"text-2xl font-bold\">Reports & Analytics</h1>\n        <Button onClick={handleDownloadPDF}>\n          <Download className=\"h-4 w-4 mr-2\" />\n          Download PDF Summary\n        </Button>\n      </div>"
);

fs.writeFileSync('src/pages/dashboard/ReportsPage.tsx', code);
