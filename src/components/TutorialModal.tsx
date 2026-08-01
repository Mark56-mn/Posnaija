import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, WifiOff, Smartphone, Receipt, MessageSquare, Users, BarChart3, ShoppingCart, Package } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const tutorialSteps = [
  {
    title: "Offline-First Operations",
    description: "Keep selling even when your internet drops. All your sales, products, and customer data sync automatically once you are back online.",
    icon: <WifiOff className="h-16 w-16 text-[var(--color-accent)] mx-auto mb-4" />
  },
  {
    title: "Quick & Full Point of Sale",
    description: "Use the Full POS for detailed transactions with discounts and taxes, or Quick Sale for fast, single-item checkouts using barcode scanning.",
    icon: <ShoppingCart className="h-16 w-16 text-[var(--color-accent)] mx-auto mb-4" />
  },
  {
    title: "Inventory Management",
    description: "Track stock levels, set low stock alerts, and monitor expiring products. Never run out of your best-selling items.",
    icon: <Package className="h-16 w-16 text-[var(--color-accent)] mx-auto mb-4" />
  },
  {
    title: "Digital Receipts via WhatsApp",
    description: "Save on paper by sending professional digital receipts directly to your customers' WhatsApp after every sale.",
    icon: <MessageSquare className="h-16 w-16 text-[var(--color-accent)] mx-auto mb-4" />
  },
  {
    title: "Debt Tracking",
    description: "Keep track of customers who owe you money. Manage partial payments, view balances, and send payment reminders easily.",
    icon: <Users className="h-16 w-16 text-[var(--color-accent)] mx-auto mb-4" />
  },
  {
    title: "Comprehensive Reports",
    description: "Understand your business performance with detailed daily, weekly, and monthly reports showing revenue, profits, and top products.",
    icon: <BarChart3 className="h-16 w-16 text-[var(--color-accent)] mx-auto mb-4" />
  }
];

export default function TutorialModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose(); // Close on last step
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-lg bg-[var(--color-surface)] relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-white z-10">
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-8 text-center min-h-[320px] flex flex-col justify-center">
          {step.icon}
          <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
          <p className="text-[var(--color-muted)] text-lg leading-relaxed">
            {step.description}
          </p>
        </div>

        <div className="p-6 border-t border-[var(--color-muted)]/10 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          
          <div className="flex gap-2">
            {tutorialSteps.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-muted)]/30'}`}
              />
            ))}
          </div>

          <Button 
            onClick={handleNext}
            className="flex items-center bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent)]/90"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
            {currentStep !== tutorialSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}
