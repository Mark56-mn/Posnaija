import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { Card } from '../../components/ui/Card';
import { formatNaira } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">Total Revenue</p>
          <p className="text-3xl font-bold text-[var(--color-accent)] mt-2">{formatNaira(totalRevenue)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted)]">Sales Count</p>
          <p className="text-3xl font-bold mt-2">{sales.length}</p>
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
