import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₦0',
      period: '',
      icon: Star,
      features: ['Up to 20 Products', 'Basic Sales Tracking', 'Online Access Only'],
      color: 'var(--color-muted)',
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '₦4,999',
      period: '/mo',
      icon: Zap,
      features: ['Unlimited Products', 'Cloud Backup', 'Basic Reporting', 'Online Access Only'],
      color: '#3b82f6',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₦6,999',
      period: '/mo',
      icon: Crown,
      features: ['Fully Offline Access', 'Advanced Analytics', 'Audit Logs', 'Expiring Products Alert'],
      color: 'var(--color-accent)',
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '₦10,000',
      period: ' one-time',
      icon: Crown,
      features: ['All Pro Features', 'Pay Once, Use Forever', 'Priority Support'],
      color: '#f59e0b',
    },
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
          Choose the plan that best fits your business needs. Upgrade, downgrade, or cancel at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isPopular = plan.id === 'pro';
          
          return (
            <Card key={plan.id} className={`relative flex flex-col transition-transform hover:scale-105 ${isPopular ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] shadow-2xl shadow-[var(--color-accent)]/10' : 'border-[var(--color-muted)]/20 shadow-lg'}`}>
              {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent)] text-[var(--color-primary)] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="p-8 border-b border-[var(--color-muted)]/10 flex-1">
                <div className="flex items-center space-x-3 mb-4" style={{ color: plan.color }}>
                  <Icon className="h-6 w-6" />
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-base text-[var(--color-muted)] font-medium">{plan.period}</span>
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="h-5 w-5 mr-3 mt-0.5 shrink-0" style={{ color: plan.color }} />
                      <span className="text-[var(--color-text)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-8 pt-6 bg-[var(--color-surface)] mt-auto rounded-b-xl">
                <Link to="/auth/register">
                  <Button className="w-full h-12 text-lg" variant={isPopular ? 'primary' : 'outline'}>
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
