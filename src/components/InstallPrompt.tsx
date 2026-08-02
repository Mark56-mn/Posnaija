import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const lastPromptTime = localStorage.getItem('lastInstallPrompt');
      const now = Date.now();
      const threeHours = 3 * 60 * 60 * 1000;

      if (!lastPromptTime || now - parseInt(lastPromptTime) > threeHours) {
        setShow(true);
        localStorage.setItem('lastInstallPrompt', now.toString());
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // In some cases beforeinstallprompt is not fired immediately or already fired
    // Let's also check periodically
    const interval = setInterval(() => {
      const lastPromptTime = localStorage.getItem('lastInstallPrompt');
      const now = Date.now();
      const threeHours = 3 * 60 * 60 * 1000;
      
      if (!isStandalone && (!lastPromptTime || now - parseInt(lastPromptTime) > threeHours)) {
        if (deferredPrompt) {
          setShow(true);
          localStorage.setItem('lastInstallPrompt', now.toString());
        }
      }
    }, 60000); // check every minute

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-sm bg-[var(--color-surface)] relative max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[var(--color-muted)]/10">
          <h3 className="font-semibold text-lg flex items-center">
            <Download className="w-5 h-5 mr-2 text-[var(--color-accent)]" />
            Install PosNaija
          </h3>
          <button onClick={() => setShow(false)} className="text-[var(--color-muted)] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 text-center">
          <p className="text-[var(--color-muted)] mb-6">
            Install the PosNaija web app on your device for a faster, app-like experience with better offline support.
          </p>
          <Button onClick={handleInstall} className="w-full h-12 text-lg">
            Install App
          </Button>
          <button onClick={() => setShow(false)} className="mt-4 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] underline">
            Maybe later
          </button>
        </div>
      </Card>
    </div>
  );
}
