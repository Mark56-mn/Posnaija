const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SalesPage.tsx', 'utf8');

code = code.replace(
  "import { formatNaira, formatDate } from '../../lib/utils';",
  "import { formatNaira, formatDate } from '../../lib/utils';\nimport { Button } from '../../components/ui/Button';\nimport { exportToCSV } from '../../lib/csv';\nimport { Download } from 'lucide-react';"
);

const handleExport = `
  const handleExportCSV = () => {
    exportToCSV(sales.map(s => ({
      receipt_number: s.receipt_number,
      date: formatDate(s.created_at),
      customer: s.customer_name,
      subtotal: s.subtotal,
      discount: s.discount,
      total: s.total,
      payment_method: s.payment_method,
      amount_paid: s.amount_paid,
      cashier: s.served_by
    })), 'sales_report.csv');
  };
`;

code = code.replace(
  "const total = sales.reduce((sum, s) => sum + s.total, 0);",
  "const total = sales.reduce((sum, s) => sum + s.total, 0);\n" + handleExport
);

code = code.replace(
  '<h1 className="text-2xl font-bold">Sales History</h1>',
  `<div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales History</h1>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>`
);

fs.writeFileSync('src/pages/dashboard/SalesPage.tsx', code);
