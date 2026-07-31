const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/AuditorDashboard.tsx', 'utf8');

code = code.replace(
  "import { BarChart3, ReceiptText, Building2, Package, LogOut } from 'lucide-react';",
  "import { BarChart3, ReceiptText, Building2, Package, LogOut, Download } from 'lucide-react';\nimport { exportToCSV } from '../../lib/csv';"
);

const exportHandler = `
  const handleExportCSV = () => {
    exportToCSV(filteredSales.map(s => ({
      receipt_number: s.receipt_number,
      date: formatDate(s.created_at),
      branch: s.branch_id ? branches.find(b=>b.id===s.branch_id)?.name : 'Main',
      customer: s.customer_name,
      subtotal: s.subtotal,
      discount: s.discount,
      total: s.total,
      payment_method: s.payment_method,
      amount_paid: s.amount_paid,
      cashier: s.served_by
    })), 'auditor_sales_report.csv');
  };
`;

code = code.replace(
  "const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);",
  "const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);\n" + exportHandler
);

code = code.replace(
  '<h1 className="text-3xl font-bold">Consolidated Dashboard</h1>',
  `<div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Consolidated Dashboard</h1>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" /> Export Sales
            </Button>
          </div>`
);

fs.writeFileSync('src/pages/dashboard/AuditorDashboard.tsx', code);
