const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

code = code.replace(
  "import { useState, useEffect } from 'react';\nimport { Input }",
  "import { useEffect } from 'react';\nimport { Input }"
);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
