const fs = require('fs');

// Patch NewSalePage.tsx
let saleCode = fs.readFileSync('src/pages/dashboard/NewSalePage.tsx', 'utf8');
saleCode = saleCode.replace(
  "admin_id: session.admin_id,",
  "admin_id: session.admin_id,\n      branch_id: session.branch_id,"
);
fs.writeFileSync('src/pages/dashboard/NewSalePage.tsx', saleCode);

// Patch ProductsPage.tsx
let prodCode = fs.readFileSync('src/pages/dashboard/ProductsPage.tsx', 'utf8');
// Fix handleImportCSV
prodCode = prodCode.replace(
  "admin_id: session.admin_id,\n          name: row.name,",
  "admin_id: session.admin_id,\n          branch_id: session.branch_id,\n          name: row.name,"
);
// Fix handleSave
prodCode = prodCode.replace(
  "admin_id: session.admin_id,\n      ...formData,",
  "admin_id: session.admin_id,\n      branch_id: session.branch_id,\n      ...formData,"
);
fs.writeFileSync('src/pages/dashboard/ProductsPage.tsx', prodCode);

