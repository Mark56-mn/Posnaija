const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = "import { useEffect } from 'react';";
const replacementImport = "import { useEffect } from 'react';\nimport InstallPrompt from './components/InstallPrompt';";
code = code.replace(targetImport, replacementImport);

const targetReturn = "<BrowserRouter>";
const replacementReturn = "<BrowserRouter>\n      <InstallPrompt />";
code = code.replace(targetReturn, replacementReturn);

fs.writeFileSync('src/App.tsx', code);
