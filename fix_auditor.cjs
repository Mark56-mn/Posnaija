const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/AuditorDashboard.tsx', 'utf8');

code = code.replace(
  "tickFormatter={(value) => \\`₦\\${value/1000}k\\`}",
  "tickFormatter={(value) => `₦${value/1000}k`}"
);

fs.writeFileSync('src/pages/dashboard/AuditorDashboard.tsx', code);
