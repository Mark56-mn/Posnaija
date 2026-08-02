import PWAInstallPrompt from '../../components/PWAInstallPrompt';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  Store, LayoutDashboard, ShoppingCart, Package, 
  ReceiptText, CreditCard, Users, BarChart3, 
  Settings, LogOut, UserCircle2, Menu, X, WifiOff
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';

export default function DashboardLayout() {
  const { session, loading, isManager, isAdmin } = usePermissions();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [syncStatus, setSyncStatus] = useState<'online' | 'syncing' | 'offline'>('online');

  useEffect(() => {
    const handleOnline = () => setSyncStatus('online');
    const handleOffline = () => setSyncStatus('offline');
    
    if (!navigator.onLine) setSyncStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">Loading...</div>;
  }

  if (!session) {
    navigate('/auth/login', { replace: true });
    return null;
  }

  const handleLogout = async () => {
    if (!session.is_staff) {
      await supabase.auth.signOut();
    }
    await db.session.clear();
    navigate('/auth/login', { replace: true });
  };

  const NavItem = ({ to, icon: Icon, label, accent = false }: any) => (
    <NavLink 
      to={to} 
      end={to === '/dashboard'}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) => `
        flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
        ${accent 
          ? 'bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent)]/90' 
          : isActive 
            ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-medium border border-[var(--color-muted)]/10' 
            : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)]/50 hover:text-[var(--color-text)]'}
      `}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );

  const hasBasicPlan = session.plan !== 'free';
  const hasProPlan = session.plan === 'pro' || session.plan === 'lifetime';

  const themeStyle = hasProPlan ? {
    ...(session.custom_theme_primary ? { '--color-primary': session.custom_theme_primary } : {}),
    ...(session.custom_theme_accent ? { '--color-accent': session.custom_theme_accent } : {}),
    ...(session.custom_theme_background ? { '--color-background': session.custom_theme_background } : {}),
    ...(session.custom_theme_surface ? { '--color-surface': session.custom_theme_surface } : {}),
  } as React.CSSProperties : undefined;

  const brandName = (hasProPlan && session.custom_theme_brand_name) 
    ? <span className="font-bold text-xl">{session.custom_theme_brand_name}</span>
    : <span className="font-normal text-xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>;
    
  const desktopBrandName = (hasProPlan && session.custom_theme_brand_name) 
    ? <span className="font-bold text-2xl">{session.custom_theme_brand_name}</span>
    : <span className="font-normal text-2xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>;

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col text-[var(--color-text)]" style={themeStyle}>
      <PWAInstallPrompt />
      <div className="flex-1 flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--color-muted)]/20 bg-[var(--color-surface)] z-20">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-[var(--color-accent)]" />
          {brandName}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -mr-2 text-[var(--color-text)]">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-[var(--color-primary)] border-r border-[var(--color-muted)]/10 flex flex-col
        transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center space-x-2 border-b border-[var(--color-muted)]/10">
          <Store className="h-7 w-7 text-[var(--color-accent)]" />
          {desktopBrandName}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {(isAdmin || isManager) && <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />}
          <NavItem to="/dashboard/new-sale" icon={ShoppingCart} label="New Sale" accent={true} />
          {(isAdmin || isManager) && (
            <>
              <NavItem to="/dashboard/products" icon={Package} label="Products" />
              <NavItem to="/dashboard/sales" icon={ReceiptText} label="Sales History" />
              <NavItem to="/dashboard/customers" icon={Users} label="Customers" />
              {hasBasicPlan && <NavItem to="/dashboard/debts" icon={CreditCard} label="Debt Tracker" />}
              {hasBasicPlan && <NavItem to="/dashboard/reports" icon={BarChart3} label="Reports" />}
            </>
          )}
          {isAdmin && <NavItem to="/dashboard/staff" icon={UserCircle2} label="Staff" />}
          {isAdmin && <NavItem to="/dashboard/settings" icon={Settings} label="Settings" />}
        </div>

        <div className="p-4 border-t border-[var(--color-muted)]/10 bg-[var(--color-primary)]">
          <div className="flex items-center space-x-3 mb-4 p-2">
            <div className={`h-3 w-3 rounded-full ${syncStatus === 'online' ? 'bg-[var(--color-success)]' : syncStatus === 'offline' ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-warning)] animate-pulse'}`} />
            <span className="text-sm text-[var(--color-muted)] flex-1 truncate">
              {session.name} <span className="uppercase text-xs opacity-60 ml-1">({session.role})</span>
            </span>
          </div>
          <Button variant="ghost" className="w-full justify-start text-[var(--color-muted)] hover:text-white" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-65px)] md:h-screen overflow-hidden">
        {syncStatus === 'offline' && hasProPlan && (
          <div className="bg-[var(--color-danger)]/10 text-[var(--color-danger)] px-4 py-2 text-sm text-center font-medium border-b border-[var(--color-danger)]/20 shrink-0">
            📵 Offline Mode — Changes will be saved locally
          </div>
        )}
        {syncStatus === 'offline' && !hasProPlan ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="bg-[var(--color-surface)] p-6 rounded-full border border-[var(--color-muted)]/10">
              <WifiOff className="h-16 w-16 text-[var(--color-muted)]" />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold">Offline Access Locked</h2>
              <p className="text-[var(--color-muted)]">
                You are currently offline. Fully offline access to make changes and continue working without an internet connection is only available on our <strong>Pro</strong> (₦6,999/mo) and <strong>Lifetime</strong> (₦10,000) plans.
              </p>
            </div>
            <Link to="/dashboard/settings">
              <Button size="lg" className="h-12 px-8">View Upgrade Options</Button>
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 md:p-8">
            <Outlet />
          </div>
        )}
      </main>
      </div>
    </div>

  );
}
