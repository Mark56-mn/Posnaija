import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });

      if (error) throw error;

      setMessage('Password reset email sent! Check your inbox for a link to reset your password.');
    } catch (err: any) {
      if (err.message?.includes('rate')) {
        setError('Too many password reset attempts. Please wait before trying again.');
      } else if (err.message?.includes('not found')) {
        setError('No account found with this email address.');
      } else {
        setError(err.message || 'Failed to send reset email');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/auth/login')}
          className="mb-6 flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        <Card className="border-[var(--color-muted)]/10 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 text-[var(--color-accent)]" />
            </div>

            <h1 className="text-2xl font-bold text-[var(--color-text)] text-center mb-2">
              Reset Password
            </h1>

            <p className="text-sm text-[var(--color-muted)] text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {message && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-400">{message}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[var(--color-muted)]/10 border border-[var(--color-muted)]/20 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-[var(--color-muted)]/5 rounded-lg border border-[var(--color-muted)]/10">
              <p className="text-xs text-[var(--color-muted)] text-center">
                💡 <strong>Tip:</strong> Try using the test credentials to login: <code className="bg-[var(--color-muted)]/10 px-2 py-1 rounded text-xs">tradebetter98@gmail.com</code> / <code className="bg-[var(--color-muted)]/10 px-2 py-1 rounded text-xs">TradeBetter2025!</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
