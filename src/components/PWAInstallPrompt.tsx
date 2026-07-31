import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Download, X } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { session } = usePermissions();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We no longer need the prompt. Clear it up.
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable || dismissed) {
    return null;
  }

  return (
    <div className="bg-[var(--color-accent)] text-[var(--color-primary)] px-4 py-3 flex items-center justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <div className="font-semibold text-sm sm:text-base">
          Install POSNaija for Offline Access
        </div>
        <div className="text-xs sm:text-sm opacity-90 mt-1 sm:mt-0">
          Get the fast, app-like experience on your device.
        </div>
      </div>
      <div className="flex items-center space-x-3 shrink-0 ml-4">
        <Button 
          onClick={handleInstallClick}
          className="bg-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-surface)] border-none text-xs sm:text-sm h-8 px-3"
        >
          <Download className="h-3 w-3 mr-1.5" />
          Install
        </Button>
        <button 
          onClick={() => setDismissed(true)} 
          className="text-[var(--color-primary)] hover:opacity-75 transition-opacity"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
