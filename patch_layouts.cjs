const fs = require('fs');

// Patch DashboardLayout.tsx
let code = fs.readFileSync('src/pages/dashboard/DashboardLayout.tsx', 'utf8');
code = code.replace(
  "import { Menu, LogOut, X, WifiOff, RefreshCw } from 'lucide-react';",
  "import { Menu, LogOut, X, WifiOff, RefreshCw } from 'lucide-react';\nimport PWAInstallPrompt from '../../components/PWAInstallPrompt';"
);
code = code.replace(
  /<div className="min-h-screen bg-\[var\(--color-background\)\] flex flex-col md:flex-row">/,
  "<div className=\"min-h-screen bg-[var(--color-background)] flex flex-col\">\n      <PWAInstallPrompt />\n      <div className=\"flex-1 flex flex-col md:flex-row\">"
);
// fix the closing tags to match the extra flex wrapper
const lastDivIndex = code.lastIndexOf("</div>");
code = code.substring(0, lastDivIndex) + "</div>\n    " + code.substring(lastDivIndex);
fs.writeFileSync('src/pages/dashboard/DashboardLayout.tsx', code);

// Patch PublicLayout.tsx
let publicCode = fs.readFileSync('src/components/layout/PublicLayout.tsx', 'utf8');
publicCode = publicCode.replace(
  "import { Link, Outlet, useLocation } from 'react-router-dom';",
  "import { Link, Outlet, useLocation } from 'react-router-dom';\nimport PWAInstallPrompt from '../PWAInstallPrompt';"
);
publicCode = publicCode.replace(
  /<div className="min-h-screen flex flex-col bg-\[var\(--color-background\)\] text-\[var\(--color-text\)\]">/,
  "<div className=\"min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)]\">\n      <PWAInstallPrompt />"
);
fs.writeFileSync('src/components/layout/PublicLayout.tsx', publicCode);

