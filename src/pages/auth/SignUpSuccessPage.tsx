import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <Card className="border-[var(--color-muted)]/10 shadow-2xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-[var(--color-success)] mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">Account Created Successfully!</h1>
            <p className="text-[var(--color-muted)] mb-8">
              Welcome to PosNaija. Please check your email to verify your account before logging in. If you don't require verification, you can log in immediately.
            </p>
            <Link to="/auth/login">
              <Button className="w-full h-12 text-lg">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
