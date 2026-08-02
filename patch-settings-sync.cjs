const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

// Add import
if (!code.includes("import { syncUp, syncDown }")) {
  code = code.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { syncUp, syncDown } from '../../lib/sync';\nimport { RefreshCw } from 'lucide-react';");
}

// Add state for syncing
if (!code.includes("const [isSyncing, setIsSyncing]")) {
  code = code.replace("const [upgrading, setUpgrading] = useState(false);", "const [upgrading, setUpgrading] = useState(false);\n  const [isSyncing, setIsSyncing] = useState(false);");
}

// Add handleSync function
const syncFunc = `
  const handleManualSync = async () => {
    if (!navigator.onLine) {
      alert("You are currently offline. Please connect to the internet to sync.");
      return;
    }
    setIsSyncing(true);
    try {
      await syncUp();
      await syncDown(session.admin_id);
      alert("Data synchronized successfully!");
    } catch (error: any) {
      console.error(error);
      alert("Sync failed: " + error.message);
    } finally {
      setIsSyncing(false);
    }
  };
`;
if (!code.includes("handleManualSync")) {
  code = code.replace("const handleSaveBusiness = async () => {", syncFunc + "\n  const handleSaveBusiness = async () => {");
}

// Add Sync Card in UI
const syncCardHtml = `
      {/* Manual Sync (Free Plan & Managers/Admins) */}
      {(session.plan === 'free' || !session.plan) && (isAdmin || isManager) && (
        <Card className="bg-[var(--color-surface)] border-[var(--color-muted)]/10 mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-[var(--color-accent)]" />
              <h2 className="text-xl font-semibold">Data Synchronization</h2>
            </div>
            <p className="text-sm text-[var(--color-muted)]">
              Manually sync your sales, products, and offline data to the cloud. Recommended before logging out or ending a shift.
            </p>
            <Button onClick={handleManualSync} disabled={isSyncing} className="w-full sm:w-auto">
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </CardContent>
        </Card>
      )}
`;

if (!code.includes("Data Synchronization")) {
  code = code.replace("<div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">", syncCardHtml + "\n      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">");
}

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
