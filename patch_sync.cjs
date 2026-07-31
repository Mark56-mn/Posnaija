const fs = require('fs');
let code = fs.readFileSync('src/lib/sync.ts', 'utf8');

code = code.replace(
  "    'products', 'sales', 'customers',\n    'categories', 'debts', 'staff'",
  "    'products', 'sales', 'customers',\n    'categories', 'debts', 'staff', 'branches', 'stock_audit_logs'"
);

fs.writeFileSync('src/lib/sync.ts', code);
