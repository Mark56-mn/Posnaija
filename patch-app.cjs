const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importTarget = `export default function App() {`;
const importReplacement = `import { useEffect } from 'react';\n\nexport default function App() {
  useEffect(() => {
    if (localStorage.getItem('lightTheme') === 'true') {
      document.body.classList.add('light-theme');
    }
  }, []);`;
if (code.includes(importTarget)) {
  code = code.replace(importTarget, importReplacement);
  fs.writeFileSync('src/App.tsx', code);
}
