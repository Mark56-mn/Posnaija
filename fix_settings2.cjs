const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

code = code.replace(
  "import { useEffect } from 'react';",
  "import React, { useEffect } from 'react';"
);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
