const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if (!code.includes('.light-theme')) {
    code = code.replace('body {', `.light-theme {
  --color-primary: #f8f9fa;
  --color-accent: #1d4ed8;
  --color-background: #f1f5f9;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-success: #16a34a;
  --color-danger: #dc2626;
  --color-warning: #d97706;
}

body {`);
    fs.writeFileSync('src/index.css', code);
}
