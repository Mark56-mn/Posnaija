import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Mail } from 'lucide-react';

export default function SignUpSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in and redirect to dashboard
    // This handles the case where auto-login was successful
    const checkAuth = async () => {
      try {
        const { supabase } = await import('../../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // User is logged in, redirect to dashboard
          navigate('/auth/callback', { replace: true });
        }
      } catch (err) {
        console.error('[v0] Error checking auth:', err);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <Card className="border-[var(--color-muted)]/10 shadow-2xl">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-[var(--color-success)] mb-6" />
            
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">
              Account Created!
            </h1>
            
            <p className="text-[var(--color-muted)] mb-6">
              Your account has been successfully created. A confirmation email has been sent to your email address.
            </p>

            <div className="bg-[var(--color-muted)]/10 rounded-lg p-4 mb-8 w-full">
              <Mail className="h-5 w-5 text-[var(--color-accent)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-muted)]">
                Check your email for a confirmation link to complete your registration.
              </p>
            </div>

            <div className="space-y-3 w-full">
              <Button 
                onClick={() => navigate('/auth/callback')}
                className="w-full h-12 text-lg"
              >
                Continue to Dashboard
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/auth/login')}
                className="w-full h-12 text-lg"
              >
                Go to Login
              </Button>
            </div>

            <p className="text-xs text-[var(--color-muted)] mt-6">
              Didn't receive an email? Check your spam folder or <a href="#" className="text-[var(--color-accent)] hover:underline">request a new link</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
