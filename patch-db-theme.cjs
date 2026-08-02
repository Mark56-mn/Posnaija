const fs = require('fs');
let code = fs.readFileSync('src/lib/db.ts', 'utf8');

const targetSession = `  offline_pin?: string;
}`;
const replacementSession = `  offline_pin?: string;
  custom_theme_primary?: string;
  custom_theme_accent?: string;
  custom_theme_background?: string;
  custom_theme_surface?: string;
  custom_theme_brand_name?: string;
}`;
code = code.replace(targetSession, replacementSession);
fs.writeFileSync('src/lib/db.ts', code);
