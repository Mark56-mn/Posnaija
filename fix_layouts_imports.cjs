const fs = require('fs');

// Patch DashboardLayout.tsx
let code = fs.readFileSync('src/pages/dashboard/DashboardLayout.tsx', 'utf8');
if (!code.includes("PWAInstallPrompt")) {
  code = code.replace(
    "import { Menu, LogOut, X, WifiOff, RefreshCw } from 'lucide-react';",
    "import { Menu, LogOut, X, WifiOff, RefreshCw } from 'lucide-react';\nimport PWAInstallPrompt from '../../components/PWAInstallPrompt';"
  );
} else if (!code.includes("import PWAInstallPrompt")) {
  code = "import PWAInstallPrompt from '../../components/PWAInstallPrompt';\n" + code;
}
fs.writeFileSync('src/pages/dashboard/DashboardLayout.tsx', code);

// Patch PublicLayout.tsx
let publicCode = fs.readFileSync('src/components/layout/PublicLayout.tsx', 'utf8');
if (!publicCode.includes("import PWAInstallPrompt")) {
  publicCode = "import PWAInstallPrompt from '../PWAInstallPrompt';\n" + publicCode;
  publicCode = publicCode.replace(
    '<div className="min-h-screen flex flex-col">',
    '<div className="min-h-screen flex flex-col">\n      <PWAInstallPrompt />'
  );
}
fs.writeFileSync('src/components/layout/PublicLayout.tsx', publicCode);

