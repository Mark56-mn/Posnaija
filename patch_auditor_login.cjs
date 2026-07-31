const fs = require('fs');
let code = fs.readFileSync('src/pages/auth/AuditorLoginPage.tsx', 'utf8');

if (!code.includes("import { Link")) {
  code = code.replace(
    "import { useNavigate } from 'react-router-dom';",
    "import { Link, useNavigate } from 'react-router-dom';"
  );
}

const termsCheckbox = `              {!isLogin && (
                <div className="flex items-start space-x-2 pt-2">
                  <input type="checkbox" required className="mt-1 border-[var(--color-muted)]/30 rounded bg-transparent" />
                  <span className="text-xs text-[var(--color-muted)] leading-relaxed">
                    I agree to the <Link to="/terms" className="text-[var(--color-accent)] hover:underline" target="_blank">Terms & Conditions</Link> and <Link to="/privacy-policy" className="text-[var(--color-accent)] hover:underline" target="_blank">Privacy Policy</Link>
                  </span>
                </div>
              )}
              <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={loading}>`;

code = code.replace(
  '<Button type="submit" className="w-full h-12 text-lg mt-6" disabled={loading}>',
  termsCheckbox
);

fs.writeFileSync('src/pages/auth/AuditorLoginPage.tsx', code);
