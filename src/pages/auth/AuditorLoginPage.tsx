import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserCircle2 } from 'lucide-react';

export default function AuditorLoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    inviteCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (signInError) throw signInError;

        const { data: profile, error: profileError } = await supabase.from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) throw profileError;
        if (profile.role !== 'auditor') throw new Error("This account is not an auditor account.");
        
        navigate('/auditor/dashboard');
      } else {
        // Register flow
        // 1. Verify invite code
        const { data: adminProfile, error: adminError } = await supabase.from('profiles')
          .select('id, business_name')
          .eq('invite_code', formData.inviteCode.toUpperCase())
          .eq('role', 'admin')
          .single();
          
        if (adminError || !adminProfile) {
          throw new Error("Invalid invite code. Please check with your administrator.");
        }

        // 2. Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
             data: {
                full_name: formData.name
             }
          }
        });
        if (signUpError) throw signUpError;
        
        if (data.user) {
          // 3. Create auditor profile
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: formData.email,
            business_name: formData.name, // storing auditor name here
            role: 'auditor',
            parent_admin_id: adminProfile.id,
            onboarding_completed: true,
            plan: 'auditor'
          });
          if (profileError) {
             // Fallback if RLS blocks it (though it shouldn't if they are logged in now)
             console.error("Profile creation error", profileError);
          }
          
          alert('Auditor account created successfully! You can now log in.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <UserCircle2 className="h-12 w-12 text-[var(--color-accent)] mb-4" />
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Auditor Portal</h1>
          <p className="text-[var(--color-muted)] mt-2 text-center">
            {isLogin ? 'Log in to view consolidated reports.' : 'Register with your business invite code.'}
          </p>
        </div>
        <Card className="border-[var(--color-muted)]/10 shadow-2xl">
          <CardContent className="p-8">
            {error && <div className="bg-[var(--color-danger)]/10 text-[var(--color-danger)] p-3 rounded-md mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Full Name</label>
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Business Invite Code</label>
                    <Input required value={formData.inviteCode} onChange={e => setFormData({...formData, inviteCode: e.target.value})} placeholder="e.g. 1a2b3c4d" />
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Email Address</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Password</label>
                <Input required type="password" minLength={8} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              
                            {!isLogin && (
                <div className="flex items-start space-x-2 pt-2">
                  <input type="checkbox" required className="mt-1 border-[var(--color-muted)]/30 rounded bg-transparent" />
                  <span className="text-xs text-[var(--color-muted)] leading-relaxed">
                    I agree to the <Link to="/terms" className="text-[var(--color-accent)] hover:underline" target="_blank">Terms & Conditions</Link> and <Link to="/privacy-policy" className="text-[var(--color-accent)] hover:underline" target="_blank">Privacy Policy</Link>
                  </span>
                </div>
              )}
                            {!isLogin && (
                <div className="flex items-start space-x-2 pt-2">
                  <input type="checkbox" required className="mt-1 border-[var(--color-muted)]/30 rounded bg-transparent" />
                  <span className="text-xs text-[var(--color-muted)] leading-relaxed">
                    I agree to the <Link to="/terms" className="text-[var(--color-accent)] hover:underline" target="_blank">Terms & Conditions</Link> and <Link to="/privacy-policy" className="text-[var(--color-accent)] hover:underline" target="_blank">Privacy Policy</Link>
                  </span>
                </div>
              )}
              <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={loading}>
                {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-[var(--color-muted)]">
              {isLogin ? (
                <>Don't have an account? <button onClick={() => { setIsLogin(false); setError(''); }} className="text-[var(--color-accent)] hover:underline font-medium">Register</button></>
              ) : (
                <>Already have an account? <button onClick={() => { setIsLogin(true); setError(''); }} className="text-[var(--color-accent)] hover:underline font-medium">Login</button></>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
