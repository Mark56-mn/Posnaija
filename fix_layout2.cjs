const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/DashboardLayout.tsx', 'utf8');

// fix the extra div at the end
code = code.replace("      </div>\n    </div>\n  );\n}", "    </div>\n  );\n}");

// inject PWAInstallPrompt properly
code = code.replace(
  '<div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row text-[var(--color-text)]">',
  '<div className="min-h-screen bg-[var(--color-background)] flex flex-col text-[var(--color-text)]">\n      <PWAInstallPrompt />\n      <div className="flex-1 flex flex-col md:flex-row relative">'
);

// wait, we need to balance the div we just added!
// Since we added `<div className="flex-1 flex flex-col md:flex-row relative">` inside the outer div, we need to add a closing `</div>` right before the end.
code = code.replace(
  "    </div>\n  );\n}",
  "      </div>\n    </div>\n  );\n}"
);

fs.writeFileSync('src/pages/dashboard/DashboardLayout.tsx', code);
