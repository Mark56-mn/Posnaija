import { useEffect, useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { db } from '../../lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatNaira, formatDateOnly } from '../../lib/utils';
import { ShoppingCart, TrendingUp, Package, AlertTriangle, BarChart3, ReceiptText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

export default function DashboardHome() {
  const { session } = usePermissions();
  const [stats, setStats] = useState({
    revenue: 0,
    profit: 0,
    totalProducts: 0,
    lowStock: 0,
  });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const today = new Date().toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos' });
      
      const sales = await db.sales.toArray();
      const todaySales = sales.filter(s => {
        const d = new Date(s.created_at).toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos' });
        return d === today;
      });

      const revenue = todaySales.reduce((sum, s) => sum + s.total, 0);
      const profit = todaySales.reduce((sum, s) => {
        try {
          const items = JSON.parse(s.items);
          return sum + items.reduce((p: number, i: any) => p + (i.selling_price - i.cost_price) * i.quantity, 0);
        } catch { return sum; }
      }, 0);

      const products = await db.products.toArray();
      const totalProducts = products.length;
      const lowStock = products.filter(p => p.quantity <= p.low_stock_alert).length;

      const expiring = products.filter(p => {
        if (!p.expiry_date) return false;
        const expiry = new Date(p.expiry_date);
        const diffDays = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return diffDays <= 30 && p.quantity > 0;
      }).sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());
      setExpiringProducts(expiring);

      setStats({ revenue, profit, totalProducts, lowStock });
      
      // Get last 5 sales
      const sorted = sales.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentSales(sorted.slice(0, 5));

      // 7 days revenue trend
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
      }).reverse();

      const revData = last7Days.map(dateObj => {
        const dateStr = dateObj.toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos' });
        const shortDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const dateSales = sales.filter(s => new Date(s.created_at).toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos' }) === dateStr);
        return {
          date: shortDate,
          revenue: dateSales.reduce((sum, s) => sum + s.total, 0)
        };
      });
      setRevenueData(revData);

      // Top products
      const productSales: Record<string, number> = {};
      sales.forEach(s => {
        try {
          const items = JSON.parse(s.items);
          items.forEach((i: any) => {
            productSales[i.name] = (productSales[i.name] || 0) + i.quantity;
          });
        } catch {}
      });

      const topProd = Object.entries(productSales)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      setTopProducts(topProd);
    }
    loadStats();
  }, []);

  if (!session) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Welcome back, {session.name}</h1>
        <p className="text-[var(--color-muted)] mt-1">{formatDateOnly(new Date().toISOString())}</p>
      </div>

      {expiringProducts.length > 0 && (session.plan === 'pro' || session.plan === 'lifetime') && (
        <Card className="border-[var(--color-warning)]/50 bg-[var(--color-warning)]/5">
          <div className="p-4 flex items-start gap-4">
            <div className="bg-[var(--color-warning)]/10 p-2 rounded-full mt-0.5">
              <Calendar className="h-5 w-5 text-[var(--color-warning)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-warning)] mb-1">Expiring Products Alert</h3>
              <p className="text-sm text-[var(--color-text)]/80">
                You have {expiringProducts.length} product{expiringProducts.length > 1 ? 's' : ''} expiring within the next 30 days.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {expiringProducts.slice(0, 5).map(p => (
                  <span key={p.id} className="text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-warning)]/30 text-[var(--color-text)] px-2 py-1 rounded">
                    {p.name} (Expires: {formatDateOnly(p.expiry_date)})
                  </span>
                ))}
                {expiringProducts.length > 5 && (
                  <span className="text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-warning)]/30 text-[var(--color-text)] px-2 py-1 rounded">
                    +{expiringProducts.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Revenue" 
          value={formatNaira(stats.revenue)} 
          icon={<ShoppingCart className="h-5 w-5 text-[var(--color-accent)]" />}
          trend="+12%"
        />
        <StatCard 
          title="Today's Profit" 
          value={formatNaira(stats.profit)} 
          icon={<TrendingUp className="h-5 w-5 text-[var(--color-success)]" />}
          trend="+8%"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<Package className="h-5 w-5 text-blue-400" />}
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStock} 
          icon={<AlertTriangle className={`h-5 w-5 ${stats.lowStock > 0 ? 'text-[var(--color-danger)]' : 'text-[var(--color-muted)]'}`} />}
          alert={stats.lowStock > 0}
        />
      </div>

      {/* Quick Actions & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <Card className="col-span-1 border-[var(--color-muted)]/10 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/dashboard/new-sale" className="block">
              <Button size="lg" className="w-full justify-start text-lg h-14">
                <ShoppingCart className="mr-3 h-5 w-5" /> New Sale
              </Button>
            </Link>
            <Link to="/dashboard/products" className="block">
              <Button variant="outline" size="lg" className="w-full justify-start h-14 border-[var(--color-muted)]/20 text-[var(--color-text)] hover:text-[var(--color-primary)]">
                <Package className="mr-3 h-5 w-5" /> Add Product
              </Button>
            </Link>
            <Link to="/dashboard/reports" className="block">
              <Button variant="outline" size="lg" className="w-full justify-start h-14 border-[var(--color-muted)]/20 text-[var(--color-text)] hover:text-[var(--color-primary)]">
                <BarChart3 className="mr-3 h-5 w-5" /> View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="col-span-1 lg:col-span-2 border-[var(--color-muted)]/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Sales</CardTitle>
            <Link to="/dashboard/sales" className="text-sm text-[var(--color-accent)] hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentSales.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-muted)]">
                <ReceiptText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No sales recorded yet today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSales.map(sale => (
                  <div key={sale.id} className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-background)] border border-[var(--color-muted)]/10">
                    <div>
                      <p className="font-medium text-[var(--color-text)]">{sale.customer_name}</p>
                      <div className="flex items-center space-x-2 text-xs text-[var(--color-muted)] mt-1">
                        <span>{new Date(sale.created_at).toLocaleTimeString('en-NG', {hour: '2-digit', minute:'2-digit'})}</span>
                        <span>•</span>
                        <span className="uppercase">{sale.payment_method}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--color-text)]">{formatNaira(sale.total)}</p>
                      <p className="text-xs mt-1">
                        {sale.synced ? <span className="text-[var(--color-success)]">☁️ Synced</span> : <span className="text-[var(--color-warning)]">⏳ Pending</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-[var(--color-muted)]/10 shadow-lg">
          <CardHeader>
            <CardTitle>Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" opacity={0.2} />
                  <XAxis dataKey="date" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value/1000}k`} width={60} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--color-text)' }}
                    itemStyle={{ color: 'var(--color-accent)' }}
                    formatter={(value: number) => [formatNaira(value), 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={3} dot={{ fill: 'var(--color-background)', stroke: 'var(--color-accent)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-muted)]/10 shadow-lg">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" opacity={0.2} horizontal={false} />
                    <XAxis type="number" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--color-text)' }}
                      itemStyle={{ color: 'var(--color-accent)' }}
                      formatter={(value: number) => [value, 'Quantity Sold']}
                    />
                    <Bar dataKey="quantity" fill="var(--color-accent)" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--color-muted)]">
                  <Package className="h-10 w-10 mb-3 opacity-20" />
                  <p>No product sales data yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, alert }: any) {
  return (
    <Card className={`border-[var(--color-muted)]/10 shadow-lg ${alert ? 'border-[var(--color-danger)]/50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--color-muted)]">{title}</p>
          <div className="p-2 bg-[var(--color-background)] rounded-lg">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-baseline space-x-2">
          <h2 className={`text-3xl font-bold ${alert ? 'text-[var(--color-danger)]' : 'text-[var(--color-text)]'}`}>{value}</h2>
          {trend && <span className="text-sm text-[var(--color-success)]">{trend}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
