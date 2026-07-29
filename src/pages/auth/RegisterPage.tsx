import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Store } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback',
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: formData.email,
        business_name: formData.businessName,
        role: 'admin',
        onboarding_completed: false,
        plan: 'free'
      });
      // Trial plan
      await supabase.from('subscriptions').insert({
        admin_id: data.user.id,
        plan: 'free',
        status: 'active',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      });
      navigate('/auth/sign-up-success');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <Store className="h-12 w-12 text-[var(--color-accent)] mb-4" />
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Create Account</h1>
          <p className="text-[var(--color-muted)] mt-2 text-center">Start your 14-day free trial. No credit card required.</p>
        </div>

        <Card className="border-[var(--color-muted)]/10 shadow-2xl">
          <CardContent className="p-8">
            {error && <div className="bg-[var(--color-danger)]/10 text-[var(--color-danger)] p-3 rounded-md mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Business Name</label>
                <Input required value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} placeholder="e.g. Ade & Sons Enterprise" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Email Address</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Password</label>
                <Input required type="password" minLength={8} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Confirm Password</label>
                <Input required type="password" minLength={8} value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
              
              <div className="flex items-start space-x-2 pt-2">
                <input type="checkbox" required className="mt-1 border-[var(--color-muted)]/30 rounded bg-transparent" />
                <span className="text-xs text-[var(--color-muted)] leading-relaxed">
                  I agree to the <Link to="/terms" className="text-[var(--color-accent)] hover:underline" target="_blank">Terms & Conditions</Link> and <Link to="/privacy-policy" className="text-[var(--color-accent)] hover:underline" target="_blank">Privacy Policy</Link>
                </span>
              </div>

              <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--color-muted)]">
              Already have an account? <Link to="/auth/login" className="text-[var(--color-accent)] hover:underline font-medium">Login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
