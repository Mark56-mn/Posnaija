import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatNaira, formatDate } from '../../lib/utils';
import { BarChart3, ReceiptText, Building2, Package, LogOut, Download } from 'lucide-react';
import { exportToCSV } from '../../lib/csv';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AuditorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [auditorProfile, setAuditorProfile] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auditor/login');
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!profile || profile.role !== 'auditor') {
        navigate('/auth/login');
        return;
      }
      setAuditorProfile(profile);

      const adminId = profile.parent_admin_id;

      // Fetch branches
      const { data: branchesData } = await supabase.from('branches').select('*').eq('admin_id', adminId);
      if (branchesData) setBranches(branchesData);

      // Fetch sales
      const { data: salesData } = await supabase.from('sales').select('*').eq('admin_id', adminId).order('created_at', { ascending: false });
      if (salesData) setSales(salesData);

      // Fetch products
      const { data: productsData } = await supabase.from('products').select('*').eq('admin_id', adminId);
      if (productsData) setProducts(productsData);

      setLoading(false);
    }
    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auditor/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">Loading...</div>;

  const filteredSales = selectedBranch === 'all' 
    ? sales 
    : selectedBranch === 'main' 
      ? sales.filter(s => !s.branch_id)
      : sales.filter(s => s.branch_id === selectedBranch);

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);

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


  // Chart Data (Sales by branch if 'all' is selected, else sales by day)
  let chartData: any[] = [];
  if (selectedBranch === 'all') {
    const branchSales: Record<string, number> = { 'Main': 0 };
    branches.forEach(b => branchSales[b.name] = 0);
    
    filteredSales.forEach(s => {
      const bName = s.branch_id ? branches.find(b => b.id === s.branch_id)?.name || 'Unknown' : 'Main';
      branchSales[bName] = (branchSales[bName] || 0) + s.total;
    });

    chartData = Object.entries(branchSales).map(([name, revenue]) => ({ name, revenue }));
  } else {
     // sales by day
     const days: Record<string, number> = {};
     filteredSales.forEach(s => {
        const d = new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        days[d] = (days[d] || 0) + s.total;
     });
     chartData = Object.entries(days).map(([name, revenue]) => ({ name, revenue })).slice(0, 14);
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-muted)]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] font-bold text-xl">
              A
            </div>
            <span className="text-xl font-bold text-[var(--color-text)]">Auditor Portal</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-[var(--color-muted)]">Welcome, {auditorProfile.business_name}</span>
             <Button variant="ghost" size="sm" onClick={handleLogout}>
               <LogOut className="h-4 w-4 mr-2" /> Logout
             </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Consolidated Dashboard</h1>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" /> Export Sales
            </Button>
          </div>
          <select 
            className="h-10 rounded-md border border-[var(--color-muted)]/30 bg-[var(--color-surface)] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="all">All Branches</option>
            <option value="main">Main Branch (No Branch)</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-[var(--color-muted)]">Total Revenue</p>
              <h2 className="text-3xl font-bold text-[var(--color-accent)] mt-2">{formatNaira(totalRevenue)}</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-[var(--color-muted)]">Transactions</p>
              <h2 className="text-3xl font-bold mt-2">{filteredSales.length}</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-[var(--color-muted)]">Active Branches</p>
              <h2 className="text-3xl font-bold mt-2">{branches.length + 1}</h2>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{selectedBranch === 'all' ? 'Revenue by Branch' : 'Revenue Trends'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" opacity={0.2} />
                      <XAxis dataKey="name" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value/1000}k`} width={60} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--color-text)' }}
                        itemStyle={{ color: 'var(--color-accent)' }}
                        formatter={(value: number) => [formatNaira(value), 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--color-muted)]">No data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {filteredSales.slice(0, 10).map(sale => (
                  <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-muted)]/10">
                    <div>
                      <p className="font-medium">{sale.customer_name}</p>
                      <div className="flex items-center space-x-2 text-xs text-[var(--color-muted)] mt-1">
                        <span>{formatDate(sale.created_at)}</span>
                        {selectedBranch === 'all' && (
                          <>
                            <span>•</span>
                            <span className="uppercase text-[var(--color-accent)]">{sale.branch_id ? branches.find(b=>b.id===sale.branch_id)?.name : 'Main'}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNaira(sale.total)}</p>
                      <p className="text-xs uppercase mt-1 text-[var(--color-muted)]">{sale.payment_method}</p>
                    </div>
                  </div>
                ))}
                {filteredSales.length === 0 && (
                   <p className="text-center py-8 text-[var(--color-muted)]">No transactions found.</p>
                )}
               </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
