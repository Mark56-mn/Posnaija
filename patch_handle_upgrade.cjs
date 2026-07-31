const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

const newHandleUpgrade = `
  const handleUpgrade = async (plan: 'free' | 'basic' | 'pro' | 'lifetime') => {
    setUpgrading(true);
    try {
      await db.session.update(session.id, { plan });
      await supabase.from('subscriptions').upsert({ admin_id: session.admin_id, plan, status: 'active' }, { onConflict: 'admin_id' });
      await supabase.from('profiles').update({ plan }).eq('id', session.admin_id);
      
      alert(\`Successfully upgraded to \${plan.toUpperCase()} plan!\`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Upgrade failed to sync, but local state was updated if payment was successful.');
    } finally {
      setUpgrading(false);
    }
  };
`;

code = code.replace(
  /const handleUpgrade = async \([\s\S]*?\} finally \{\s*setUpgrading\(false\);\s*\}\s*\};/,
  newHandleUpgrade.trim()
);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
