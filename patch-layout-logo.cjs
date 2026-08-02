const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/DashboardLayout.tsx', 'utf8');

code = code.replace(
  '          <Store className="h-6 w-6 text-[var(--color-accent)]" />\\n          <span className="font-normal text-xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>',
  '          <Store className="h-6 w-6 text-[var(--color-accent)]" />\\n          {brandName}'
);
code = code.replace(
  '          <Store className="h-6 w-6 text-[var(--color-accent)]" />\n          <span className="font-normal text-xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>',
  '          <Store className="h-6 w-6 text-[var(--color-accent)]" />\n          {brandName}'
);

code = code.replace(
  '          <Store className="h-7 w-7 text-[var(--color-accent)]" />\\n          <span className="font-normal text-2xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>',
  '          <Store className="h-7 w-7 text-[var(--color-accent)]" />\\n          {desktopBrandName}'
);
code = code.replace(
  '          <Store className="h-7 w-7 text-[var(--color-accent)]" />\n          <span className="font-normal text-2xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>',
  '          <Store className="h-7 w-7 text-[var(--color-accent)]" />\n          {desktopBrandName}'
);

fs.writeFileSync('src/pages/dashboard/DashboardLayout.tsx', code);
