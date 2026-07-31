import PWAInstallPrompt from '../PWAInstallPrompt';
import { Outlet, Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { Button } from '../ui/Button';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PWAInstallPrompt />
      <header className="border-b border-[var(--color-muted)]/20 bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-[var(--color-accent)]" />
            <span className="font-normal text-[var(--color-text)] text-xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-[var(--color-muted)]">
            <Link to="/#features" className="hover:text-[var(--color-text)] transition-colors">Features</Link>
            <Link to="/pricing" className="hover:text-[var(--color-text)] transition-colors">Pricing</Link>
            <Link to="/faq" className="hover:text-[var(--color-text)] transition-colors">FAQ</Link>
            <Link to="/about" className="hover:text-[var(--color-text)] transition-colors">About</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-muted)]/20 py-8 md:py-12 bg-[var(--color-primary)]">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Store className="h-5 w-5 text-[var(--color-accent)]" />
              <span className="font-normal text-[var(--color-text)] text-lg">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>
            </Link>
            <p className="text-sm text-[var(--color-muted)]">
              The POS built for Nigerian business.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link to="/pricing" className="hover:text-[var(--color-text)]">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--color-text)]">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link to="/about" className="hover:text-[var(--color-text)]">About</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-text)]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link to="/privacy-policy" className="hover:text-[var(--color-text)]">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[var(--color-text)]">Terms</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[var(--color-text)]">Refund Policy</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-[var(--color-text)]">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-[var(--color-muted)]/20 text-center text-sm text-[var(--color-muted)]">
          © {new Date().getFullYear()} PosNaija. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
