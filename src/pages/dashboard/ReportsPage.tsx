import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { Card } from '../../components/ui/Card';
import { formatNaira } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  const [sales, setSales] = useState<any[]>([]);
  
  useEffect(() => {
    db.sales.toArray().then(setSales);
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  
  const salesByDate = sales.reduce((acc, s) => {
    const date = new Date(s.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + s.total;
    return acc;
  }, {});

  const chartData = Object.keys(salesByDate).slice(-7).map(date => ({

    name: date,
    revenue: salesByDate[date]
  }));


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text('Sales Performance Report', 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
    // Summary Metrics
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text('Summary', 14, 40);
    
    doc.setFontSize(11);
    doc.text(`Total Revenue: ${formatNaira(totalRevenue)}`, 14, 50);
    doc.text(`Total Transactions: ${sales.length}`, 14, 58);
    doc.text(`Average Sale Value: ${sales.length > 0 ? formatNaira(totalRevenue / sales.length) : formatNaira(0)}`, 14, 66);
    
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <Button onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF Summary
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">Total Revenue</p>
          <p className="text-3xl font-bold text-[var(--color-accent)] mt-2">{formatNaira(totalRevenue)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">Total Transactions</p>
          <p className="text-3xl font-bold mt-2">{sales.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">Average Value</p>
          <p className="text-3xl font-bold mt-2">{sales.length > 0 ? formatNaira(totalRevenue / sales.length) : formatNaira(0)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-6">Revenue - Last 7 Days</h3>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--color-muted)" />
                <YAxis stroke="var(--color-muted)" />
                <Tooltip cursor={{fill: 'var(--color-surface)'}} contentStyle={{backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-accent)', borderRadius: '8px'}} />
                <Bar dataKey="revenue" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--color-muted)]">
              Not enough data for chart
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
