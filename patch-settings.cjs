const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

const importTarget = `import { Star, Zap, Crown, Check } from 'lucide-react';`;
const importReplacement = `import { Star, Zap, Crown, Check, Fingerprint } from 'lucide-react';`;
if (code.includes(importTarget)) {
  code = code.replace(importTarget, importReplacement);
} else {
  code = code.replace(`import { Star, Zap, Crown, Check }`, `import { Star, Zap, Crown, Check, Fingerprint }`);
}

const businessProfileEnd = `          </div>
        </CardContent>
      </Card>`;

const passkeySection = `          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-[var(--color-muted)]/10 pb-2">
            <Fingerprint className="h-5 w-5 text-[var(--color-accent)]" />
            <h2 className="text-xl font-semibold">Device Security (Offline Login)</h2>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            Register this device to allow offline login using your device's built-in security (Face ID, Touch ID, Windows Hello, or Passkey). 
            This enables secure access to your POS dashboard even without an internet connection.
          </p>
          <Button onClick={async () => {
            try {
              if (!window.PublicKeyCredential) {
                alert("Your device does not support passkeys or biometric authentication.");
                return;
              }
              const challenge = new Uint8Array(32);
              window.crypto.getRandomValues(challenge);
              const userId = new Uint8Array(16);
              window.crypto.getRandomValues(userId);
              
              const cred = await navigator.credentials.create({
                publicKey: {
                  challenge: challenge,
                  rp: { name: "PosNaija", id: window.location.hostname },
                  user: {
                    id: userId,
                    name: session.email || 'admin@posnaija.com',
                    displayName: session.name || 'Admin',
                  },
                  pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
                  authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "required",
                  },
                  timeout: 60000,
                  attestation: "none",
                }
              });
              
              if (cred) {
                await db.passkeys.put({
                  id: cred.id,
                  admin_id: session.admin_id,
                  name: session.name,
                  email: session.email || '',
                  created_at: new Date().toISOString()
                });
                alert("Device security registered successfully! You can now use your device biometrics/passkey to log in while offline.");
              }
            } catch (err) {
              console.error(err);
              alert("Passkey registration failed: " + err.message);
            }
          }}>
            Register Offline Access (Passkey)
          </Button>
        </CardContent>
      </Card>`;

code = code.replace(businessProfileEnd, passkeySection);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
