const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

const importTarget = `import { Check, Star, Zap, Crown, Fingerprint } from 'lucide-react';`;
const importReplacement = `import { Check, Star, Zap, Crown, Fingerprint, Printer, Moon, Sun } from 'lucide-react';`;
if (code.includes(importTarget)) {
  code = code.replace(importTarget, importReplacement);
}

const componentStartTarget = `export default function SettingsPage() {
  const { session } = usePermissions();`;
const componentStartReplacement = `export default function SettingsPage() {
  const { session } = usePermissions();
  const [lightTheme, setLightTheme] = useState(localStorage.getItem('lightTheme') === 'true');
  const [autoPrint, setAutoPrint] = useState(localStorage.getItem('autoPrint') === 'true');

  useEffect(() => {
    if (lightTheme) {
      document.body.classList.add('light-theme');
      localStorage.setItem('lightTheme', 'true');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.removeItem('lightTheme');
    }
  }, [lightTheme]);

  useEffect(() => {
    if (autoPrint) {
      localStorage.setItem('autoPrint', 'true');
    } else {
      localStorage.removeItem('autoPrint');
    }
  }, [autoPrint]);
`;
code = code.replace(componentStartTarget, componentStartReplacement);

const preferencesSection = `      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-[var(--color-muted)]/10 pb-2">
            <h2 className="text-xl font-semibold">Device Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium flex items-center gap-2"><Sun className="w-4 h-4" /> / <Moon className="w-4 h-4" /> High-Contrast Light Mode</p>
                <p className="text-sm text-[var(--color-muted)]">Toggle between dark theme and high-contrast light mode for better outdoor visibility.</p>
              </div>
              <button 
                onClick={() => setLightTheme(!lightTheme)}
                className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none \${lightTheme ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-surface)] border border-[var(--color-muted)]/30'}\`}
              >
                <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${lightTheme ? 'translate-x-6' : 'translate-x-1'}\`} />
              </button>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--color-muted)]/10 pt-4">
              <div>
                <p className="font-medium flex items-center gap-2"><Printer className="w-4 h-4" /> Auto-Print Receipt</p>
                <p className="text-sm text-[var(--color-muted)]">Automatically trigger browser print dialog after successful payment.</p>
              </div>
              <button 
                onClick={() => setAutoPrint(!autoPrint)}
                className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none \${autoPrint ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-surface)] border border-[var(--color-muted)]/30'}\`}
              >
                <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${autoPrint ? 'translate-x-6' : 'translate-x-1'}\`} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
`;

const insertAfterPasskeyTarget = `Offline Login (Passkey)
          </Button>
        </CardContent>
      </Card>`;

code = code.replace(insertAfterPasskeyTarget, insertAfterPasskeyTarget + '\n\n' + preferencesSection);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
