import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Store, UserCircle } from 'lucide-react';
import { syncDown } from '../../lib/sync';

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'admin' | 'staff'>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Admin form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Staff form
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [pin, setPin] = useState('');

  useEffect(() => {
    db.staff.toArray().then(setStaffList);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      let { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      
      if (!profile) {
        // Create profile if it doesn't exist (e.g. failed during signup due to RLS without session)
        const businessName = data.user.user_metadata?.business_name || 'My Business';
        const { data: newProfile, error: createError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          business_name: businessName,
          role: 'admin',
          onboarding_completed: false,
          plan: 'free'
        }).select().single();
        
        if (createError) throw new Error("Failed to initialize profile: " + createError.message);
        profile = newProfile;
        
        // Also ensure a free subscription exists
        await supabase.from('subscriptions').insert({
          admin_id: data.user.id,
          plan: 'free',
          status: 'active',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      await db.session.put({
        id: 1,
        admin_id: data.user.id,
        name: profile.business_name,
        email: data.user.email,
        role: profile.role || 'admin',
        business_name: profile.business_name,
        business_phone: profile.business_phone,
        whatsapp_number: profile.whatsapp_number,
        business_logo: profile.business_logo,
        is_staff: false,
        onboarding_completed: profile.onboarding_completed,
        plan: profile.plan || 'free',
        offline_pin: profile.offline_pin || undefined,
      });

      syncDown(data.user.id).catch(console.error);

      if (!profile.onboarding_completed) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (selectedStaff.pin === pin) {
        const adminSession = await db.session.get(1); // To get business name
        await db.session.put({
          id: 1,
          admin_id: selectedStaff.admin_id,
          staff_id: selectedStaff.id,
          name: selectedStaff.name,
          role: selectedStaff.role,
          business_name: adminSession?.business_name || 'Business',
          is_staff: true,
          onboarding_completed: true,
          plan: adminSession?.plan || 'free',
        });
        
        if (selectedStaff.role === 'staff') {
          navigate('/dashboard/new-sale', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError('Wrong PIN');
        setPin('');
      }
    } catch (err: any) {
      setError('Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <Store className="h-12 w-12 text-[var(--color-accent)] mb-4" />
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Welcome Back</h1>
        </div>

        <Card className="border-[var(--color-muted)]/10 shadow-2xl overflow-hidden">
          <div className="flex border-b border-[var(--color-muted)]/10">
            <button 
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'admin' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)]'}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Login
            </button>
            <button 
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'staff' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)]'}`}
              onClick={() => setActiveTab('staff')}
            >
              Staff PIN
            </button>
          </div>

          <CardContent className="p-8">
            {error && <div className="bg-[var(--color-danger)]/10 text-[var(--color-danger)] p-3 rounded-md mb-4 text-sm">{error}</div>}
            
            {activeTab === 'admin' ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Email Address</label>
                  <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-[var(--color-muted)] block">Password</label>
                    <Link to="/auth/forgot-password" className="text-xs text-[var(--color-accent)] hover:underline">Forgot?</Link>
                  </div>
                  <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <div className="mt-6 text-center text-sm text-[var(--color-muted)]">
                  Don't have an account? <Link to="/auth/register" className="text-[var(--color-accent)] hover:underline font-medium">Register here</Link>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {!selectedStaff ? (
                  staffList.length > 0 ? (
                    <div className="space-y-2">
                      {staffList.map(s => (
                        <button 
                          key={s.id} 
                          onClick={() => setSelectedStaff(s)}
                          className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--color-muted)]/10 hover:border-[var(--color-accent)] bg-[var(--color-background)] transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <UserCircle className="h-8 w-8 text-[var(--color-muted)]" />
                            <span className="font-medium text-[var(--color-text)]">{s.name}</span>
                          </div>
                          <span className="text-xs uppercase px-2 py-1 bg-[var(--color-surface)] rounded text-[var(--color-muted)]">{s.role}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--color-muted)]">
                      <p>No staff found.</p>
                      <p className="text-sm mt-2">Admins can add staff in Settings.</p>
                    </div>
                  )
                ) : (
                  <form onSubmit={handleStaffLogin} className="space-y-6">
                    <div className="text-center">
                      <p className="text-[var(--color-muted)] text-sm">Logging in as</p>
                      <p className="text-xl font-medium text-[var(--color-text)] mt-1">{selectedStaff.name}</p>
                    </div>
                    <div>
                      <Input 
                        required 
                        type="password" 
                        maxLength={6} 
                        value={pin} 
                        onChange={e => setPin(e.target.value)} 
                        placeholder="Enter PIN" 
                        className="text-center text-2xl tracking-[0.5em] h-14"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline" onClick={() => setSelectedStaff(null)}>Back</Button>
                      <Button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Login'}</Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
