const fs = require('fs');
let code = fs.readFileSync('src/hooks/usePermissions.ts', 'utf8');

const target = `  return {
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
  };`;

const replacement = `  const isTrialActive = () => {
    if (!session || !session.created_at) return false;
    const createdAt = new Date(session.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14;
  };

  const hasFullAccess = () => {
    return session?.plan === 'pro' || session?.plan === 'lifetime' || session?.plan === 'basic' || isTrialActive();
  };

  return {
    loading,
    session,
    isAdmin: session?.role === 'admin',
    isManager: session?.role === 'manager',
    isCashier: session?.role === 'staff',
    isStaff: session?.is_staff === true,
    
    // Applying the access check logic
    canAccessReports: hasFullAccess() && ['admin', 'manager'].includes(session?.role || ''),
    canAccessProducts: hasFullAccess() && ['admin', 'manager'].includes(session?.role || ''),
    canAccessSettings: hasFullAccess() && session?.role === 'admin',
    canAccessStaff: hasFullAccess() && session?.role === 'admin',
    canAccessDebts: hasFullAccess() && ['admin', 'manager'].includes(session?.role || ''),
    canAccessCustomers: hasFullAccess() && ['admin', 'manager'].includes(session?.role || ''),
    canMakeSales: true,
  };`;

code = code.replace(target, replacement);

fs.writeFileSync('src/hooks/usePermissions.ts', code);
