import { usePermissions } from '../../hooks/usePermissions';
import React, { useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Trash2, Building2, UserCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { db } from '../../lib/db';
import { Check, Star, Zap, Crown, Fingerprint, Printer, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { PaystackButton } from 'react-paystack';

export default function SettingsPage() {
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

  const [upgrading, setUpgrading] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    business_name: '',
    business_address: '',
    business_phone: '',
    whatsapp_number: ''
  });

  useEffect(() => {
    if (session) {
      setBusinessForm({
        business_name: session.business_name || '',
        business_address: session.business_address || '',
        business_phone: session.business_phone || '',
        whatsapp_number: session.whatsapp_number || ''
      });
    }
  }, [session]);

  const handleSaveBusiness = async () => {
    try {
      // Update local db
      await db.session.update(session.id, businessForm);
      // Try to update remote if online
      if (navigator.onLine && session.admin_id) {
        await supabase
          .from('profiles')
          .update(businessForm)
          .eq('id', session.admin_id);
      }
      setIsEditingBusiness(false);
      alert('Business profile updated successfully!');
      window.location.reload(); // Refresh to reflect changes everywhere
    } catch (e) {
      console.error(e);
      alert('Failed to update business profile');
    }
  };
  const branches = useLiveQuery(() => db.branches.toArray());


  useEffect(() => {
    async function ensureInviteCode() {
      if (session && session.role === 'admin') {
        const { data } = await supabase.from('profiles').select('invite_code').eq('id', session.admin_id).single();
        if (data && !data.invite_code) {
          const code = Math.random().toString(36).substring(2, 8).toUpperCase();
          await supabase.from('profiles').update({ invite_code: code }).eq('id', session.admin_id);
          // Just update local display
          session.invite_code = code;
        } else if (data) {
          session.invite_code = data.invite_code;
        }
      }
    }
    ensureInviteCode();
  }, [session]);


  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newBranchName.trim()) return;
    await db.branches.put({
      id: crypto.randomUUID(),
      admin_id: session.admin_id,
      name: newBranchName.trim(),
      created_at: new Date().toISOString(),
      synced: false
    });
    setNewBranchName('');
  };

  const handleDeleteBranch = async (id: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      await db.branches.delete(id);
      if (session.branch_id === id) {
         await db.session.update(session.id, { branch_id: undefined, branch_name: undefined });
         window.location.reload();
      }
    }
  };

  const handleSetDeviceBranch = async (id: string) => {
    if (!session) return;
    if (id === '') {
      await db.session.update(session.id, { branch_id: undefined, branch_name: undefined });
    } else {
      const b = await db.branches.get(id);
      if (b) await db.session.update(session.id, { branch_id: b.id, branch_name: b.name });
    }
    window.location.reload();
  };


  if (!session) return null;

  const handleUpgrade = async (plan: 'free' | 'basic' | 'pro' | 'lifetime') => {
    setUpgrading(true);
    try {
      await db.session.update(session.id, { plan });
      await supabase.from('subscriptions').upsert({ admin_id: session.admin_id, plan, status: 'active' }, { onConflict: 'admin_id' });
      await supabase.from('profiles').update({ plan }).eq('id', session.admin_id);
      
      alert(`Successfully upgraded to ${plan.toUpperCase()} plan!`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Upgrade failed to sync, but local state was updated if payment was successful.');
    } finally {
      setUpgrading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₦0',
      period: '',
      icon: Star,
      features: ['Up to 20 Products', 'Basic Sales Tracking', 'Online Access Only'],
      color: 'var(--color-muted)',
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '₦4,999',
      period: '/mo',
      icon: Zap,
      features: ['Unlimited Products', 'Cloud Backup', 'Basic Reporting', 'Online Access Only'],
      color: '#3b82f6',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₦6,999',
      period: '/mo',
      icon: Crown,
      features: ['Fully Offline Access', 'Advanced Analytics', 'Audit Logs', 'Expiring Products Alert'],
      color: 'var(--color-accent)',
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '₦10,000',
      period: ' one-time',
      icon: Crown,
      features: ['All Pro Features', 'Pay Once, Use Forever', 'Priority Support'],
      color: '#f59e0b',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--color-muted)]/10 pb-2">
            <h2 className="text-xl font-semibold">Business Profile</h2>
            {!isEditingBusiness ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditingBusiness(true)}>Edit Info</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingBusiness(false)}>Cancel</Button>
                <Button size="sm" className="bg-[var(--color-accent)] text-[var(--color-primary)]" onClick={handleSaveBusiness}>Save</Button>
              </div>
            )}
          </div>
          
          {isEditingBusiness ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">Business Name</label>
                <Input 
                  value={businessForm.business_name} 
                  onChange={e => setBusinessForm({...businessForm, business_name: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">Business Address</label>
                <Input 
                  value={businessForm.business_address} 
                  onChange={e => setBusinessForm({...businessForm, business_address: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">Business Phone</label>
                <Input 
                  value={businessForm.business_phone} 
                  onChange={e => setBusinessForm({...businessForm, business_phone: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">WhatsApp Number</label>
                <Input 
                  value={businessForm.whatsapp_number} 
                  onChange={e => setBusinessForm({...businessForm, whatsapp_number: e.target.value})} 
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Business Name</p>
                <p className="font-medium text-lg">{session.business_name}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">Address</p>
                <p className="font-medium text-lg">{session.business_address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">Phone / WhatsApp</p>
                <p className="font-medium text-lg">{session.business_phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">Admin Email</p>
                <p className="font-medium text-lg">{session.email || 'N/A'}</p>
              </div>
            </div>
          )}
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
      </Card>

      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Subscription Plans</h2>
          <p className="text-[var(--color-muted)]">Choose the plan that best fits your business needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = (session.plan || 'free') === plan.id;
            
            return (
              <Card key={plan.id} className={`relative flex flex-col ${isCurrent ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]' : 'border-[var(--color-muted)]/20'}`}>
                {isCurrent && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent)] text-[var(--color-primary)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Current Plan
                  </div>
                )}
                <div className="p-6 border-b border-[var(--color-muted)]/10 flex-1">
                  <div className="flex items-center space-x-2 mb-2" style={{ color: plan.color }}>
                    <Icon className="h-5 w-5" />
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-[var(--color-muted)]">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Check className="h-4 w-4 mr-2 mt-0.5 shrink-0" style={{ color: plan.color }} />
                        <span className="text-[var(--color-muted)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-6 pt-4 bg-[var(--color-surface)]">
                  {isCurrent ? (
                    <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                  ) : plan.id === 'free' ? (
                    <Button className="w-full" variant="primary" onClick={() => handleUpgrade('free')}>Downgrade to Free</Button>
                  ) : (
                    <PaystackButton
                      className="flex h-10 w-full items-center justify-center rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 transition-colors"
                      text="Upgrade"
                      reference={(new Date()).getTime().toString()}
                      email={session.email || 'customer@posnaija.com'}
                      amount={parseInt(plan.price.replace(/[^0-9]/g, ''), 10) * 100}
                      publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_b867c0500f40fb17849e75cfa7975f284e3c9886'}
                      onSuccess={(ref) => handleUpgrade(plan.id as any)}
                      onClose={() => console.log('Payment closed')}
                    />
                  )}
                </div>

              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
