import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { Card } from '../../components/ui/Card';
import { formatNaira, formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { exportToCSV } from '../../lib/csv';
import { Download } from 'lucide-react';

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    db.sales.toArray().then(s => {
      setSales(s.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    });
  }, []);

  const total = sales.reduce((sum, s) => sum + s.total, 0);

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


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales History</h1>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">Total Sales Value</p>
          <p className="text-3xl font-bold text-[var(--color-accent)] mt-2">{formatNaira(total)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">Transactions</p>
          <p className="text-3xl font-bold mt-2">{sales.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">Average Value</p>
          <p className="text-3xl font-bold mt-2">{sales.length > 0 ? formatNaira(total / sales.length) : formatNaira(0)}</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-muted)]/10 text-[var(--color-muted)] text-sm">
                <th className="p-4 font-medium">Receipt #</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-muted)]/10">
              {sales.map(s => (
                <tr key={s.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                  <td className="p-4 font-medium">{s.receipt_number}</td>
                  <td className="p-4 text-[var(--color-muted)]">{formatDate(s.created_at)}</td>
                  <td className="p-4">{s.customer_name}</td>
                  <td className="p-4 font-medium text-[var(--color-accent)]">{formatNaira(s.total)}</td>
                  <td className="p-4 uppercase text-xs">{s.payment_method}</td>
                  <td className="p-4 text-xs">
                    {s.synced ? <span className="text-[var(--color-success)]">☁️ Synced</span> : <span className="text-[var(--color-warning)]">⏳ Pending</span>}
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--color-muted)]">No sales found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
