import { usePermissions } from '../../hooks/usePermissions';
import React, { useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Trash2, Building2, UserCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { db } from '../../lib/db';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { session } = usePermissions();
  const [upgrading, setUpgrading] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
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
      // In a real app, this would redirect to a payment gateway like Paystack
      await db.session.update(session.id, { plan });
      alert(`Successfully upgraded to ${plan.toUpperCase()} plan!`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Upgrade failed');
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
          <h2 className="text-xl font-semibold border-b border-[var(--color-muted)]/10 pb-2">Business Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Business Name</p>
              <p className="font-medium text-lg">{session.business_name}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)]">Admin Email</p>
              <p className="font-medium text-lg">{session.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)]">Role</p>
              <p className="font-medium text-lg uppercase">{session.role}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)]">Current Plan</p>
              <p className="font-medium text-lg uppercase text-[var(--color-accent)]">{session.plan || 'Free'}</p>
            </div>
          </div>
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
                  <Button 
                    className="w-full" 
                    variant={isCurrent ? "outline" : "primary"}
                    disabled={isCurrent || upgrading}
                    onClick={() => handleUpgrade(plan.id as any)}
                  >
                    {isCurrent ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
