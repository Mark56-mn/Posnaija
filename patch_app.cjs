const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
code = code.replace(
  "import PublicLayout from './components/layout/PublicLayout';",
  "import PublicLayout from './components/layout/PublicLayout';\nimport AuditorLoginPage from './pages/auth/AuditorLoginPage';\nimport AuditorDashboard from './pages/dashboard/AuditorDashboard';"
);

// Add routes
code = code.replace(
  "<Route path=\"/auth/callback\" element={<AuthCallback />} />",
  "<Route path=\"/auth/callback\" element={<AuthCallback />} />\n        <Route path=\"/auditor/login\" element={<AuditorLoginPage />} />\n        <Route path=\"/auditor/dashboard\" element={<AuditorDashboard />} />"
);

fs.writeFileSync('src/App.tsx', code);
