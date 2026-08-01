const fs = require('fs');
let code = fs.readFileSync('src/pages/auth/LoginPage.tsx', 'utf8');

const importTarget = `import { Store, UserCircle } from 'lucide-react';`;
const importReplacement = `import { Store, UserCircle, Fingerprint } from 'lucide-react';`;
if (code.includes(importTarget)) {
  code = code.replace(importTarget, importReplacement);
} else {
  code = code.replace(`import { Store, UserCircle }`, `import { Store, UserCircle, Fingerprint }`);
}

const formEndTarget = `                <div className="mt-6 text-center text-sm text-[var(--color-muted)]">
                  Don't have an account? <Link to="/auth/register" className="text-[var(--color-accent)] hover:underline font-medium">Register here</Link>
                </div>
              </form>`;
const formEndReplacement = `                <div className="mt-6 text-center text-sm text-[var(--color-muted)]">
                  Don't have an account? <Link to="/auth/register" className="text-[var(--color-accent)] hover:underline font-medium">Register here</Link>
                </div>
                
                <div className="mt-6 pt-6 border-t border-[var(--color-muted)]/10">
                  <Button type="button" variant="outline" className="w-full flex items-center justify-center space-x-2" onClick={async () => {
                    try {
                      if (!window.PublicKeyCredential) {
                        alert("Your device does not support passkeys.");
                        return;
                      }
                      
                      const challenge = new Uint8Array(32);
                      window.crypto.getRandomValues(challenge);
                      
                      const assertion = await navigator.credentials.get({
                        publicKey: {
                          challenge: challenge,
                          rpId: window.location.hostname,
                          userVerification: "required",
                        }
                      });
                      
                      if (assertion) {
                        const passkey = await db.passkeys.get(assertion.id);
                        if (passkey) {
                           await db.session.put({
                             id: 1,
                             admin_id: passkey.admin_id,
                             name: passkey.name,
                             email: passkey.email,
                             role: 'admin',
                             business_name: 'Offline Mode (Device Authorized)',
                             is_staff: false,
                             onboarding_completed: true,
                             plan: 'pro'
                           });
                           window.location.href = '/dashboard';
                        } else {
                           alert("Passkey recognized, but no matching user found on this device. Please login with email/password first.");
                        }
                      }
                    } catch (err) {
                      console.error(err);
                      alert("Passkey login failed: " + err.message);
                    }
                  }}>
                    <Fingerprint className="h-5 w-5 mr-2 text-[var(--color-accent)]" />
                    Offline Login (Passkey)
                  </Button>
                </div>
              </form>`;

code = code.replace(formEndTarget, formEndReplacement);

fs.writeFileSync('src/pages/auth/LoginPage.tsx', code);
