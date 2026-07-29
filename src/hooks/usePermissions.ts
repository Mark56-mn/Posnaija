import { useEffect, useState } from 'react';
import { db, Session } from '../lib/db';

export function usePermissions() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.session.get(1).then(s => {
      setSession(s || null);
      setLoading(false);
    });
  }, []);

  return {
    loading,
    session,
    isAdmin: session?.role === 'admin',
    isManager: session?.role === 'manager',
    isCashier: session?.role === 'staff',
    isStaff: session?.is_staff === true,
    canAccessReports: ['admin', 'manager'].includes(session?.role || ''),
    canAccessProducts: ['admin', 'manager'].includes(session?.role || ''),
    canAccessSettings: session?.role === 'admin',
    canAccessStaff: session?.role === 'admin',
    canAccessDebts: ['admin', 'manager'].includes(session?.role || ''),
    canAccessCustomers: ['admin', 'manager'].includes(session?.role || ''),
    canMakeSales: true,
  };
}
