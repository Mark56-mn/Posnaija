import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatNaira, formatDate } from '../../lib/utils';
import { MessageSquare } from 'lucide-react';

export default function DebtsPage() {
  const [debts, setDebts] = useState<any[]>([]);

  useEffect(() => {
    db.debts.toArray().then(d => {
      setDebts(d.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    });
  }, []);

  const totalOutstanding = debts.reduce((sum, d) => sum + d.balance, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Debt Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5">
          <p className="text-sm text-[var(--color-danger)] font-medium">Total Outstanding</p>
          <p className="text-3xl font-bold text-[var(--color-danger)] mt-2">{formatNaira(totalOutstanding)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">Active Debtors</p>
          <p className="text-3xl font-bold mt-2">{new Set(debts.filter(d => d.balance > 0).map(d => d.customer_name)).size}</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-muted)]/10 text-[var(--color-muted)] text-sm">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium text-right">Paid</th>
                <th className="p-4 font-medium text-right">Balance</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-muted)]/10">
              {debts.map(d => (
                <tr key={d.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                  <td className="p-4 font-medium">{d.customer_name}</td>
                  <td className="p-4 text-[var(--color-muted)]">{formatDate(d.created_at)}</td>
                  <td className="p-4 text-right">{formatNaira(d.amount)}</td>
                  <td className="p-4 text-right text-[var(--color-success)]">{formatNaira(d.amount_paid)}</td>
                  <td className="p-4 text-right font-bold text-[var(--color-danger)]">{formatNaira(d.balance)}</td>
                  <td className="p-4 text-center">
                    <Button variant="ghost" size="sm" className="text-[var(--color-success)] hover:text-[var(--color-success)] hover:bg-[var(--color-success)]/10">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Remind
                    </Button>
                  </td>
                </tr>
              ))}
              {debts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--color-muted)]">No debts recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
