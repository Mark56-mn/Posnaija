const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/DashboardLayout.tsx', 'utf8');

code = code.replace("import { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';");

code = code.replace(
  "    : {brandName};",
  '    : <span className="font-normal text-xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>;'
);

code = code.replace(
  "    : {desktopBrandName};",
  '    : <span className="font-normal text-2xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>;'
);

fs.writeFileSync('src/pages/dashboard/DashboardLayout.tsx', code);
