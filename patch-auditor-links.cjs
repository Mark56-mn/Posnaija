const fs = require('fs');
let code = fs.readFileSync('src/pages/auth/AuditorLoginPage.tsx', 'utf8');

code = code.replace(
  '<Link to="/terms" className="text-[var(--color-accent)] hover:underline" target="_blank">Terms & Conditions</Link>',
  '<Link to="/terms" className="text-[var(--color-accent)] hover:underline">Terms & Conditions</Link>'
);
code = code.replace(
  '<Link to="/privacy-policy" className="text-[var(--color-accent)] hover:underline" target="_blank">Privacy Policy</Link>',
  '<Link to="/privacy-policy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>'
);

fs.writeFileSync('src/pages/auth/AuditorLoginPage.tsx', code);
