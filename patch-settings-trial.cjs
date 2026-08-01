const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

const target = `<p className="font-medium text-lg uppercase text-[var(--color-accent)]">{session.plan || 'Free'}</p>`;
const replacement = `{(() => {
                let planText = session.plan || 'Free';
                if (session.created_at) {
                  const diffDays = Math.ceil(Math.abs(new Date().getTime() - new Date(session.created_at).getTime()) / (1000 * 60 * 60 * 24));
                  if (diffDays <= 14 && (planText === 'free' || !planText)) {
                    planText = \`Trial (\${14 - diffDays + 1} days left)\`;
                  }
                }
                return <p className="font-medium text-lg uppercase text-[var(--color-accent)]">{planText}</p>;
              })()}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
}
