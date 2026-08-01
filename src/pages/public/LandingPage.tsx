import React from "react";
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { WifiOff, Smartphone, Receipt, MessageSquare, Users, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import TutorialModal from '../../components/TutorialModal';

export default function LandingPage() {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 text-center px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            The POS Built for <span className="text-[var(--color-accent)]">Nigerian Business</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
            Manage sales, inventory, and debts — even without internet. Built for shops, markets, and businesses across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">Start Free 14-Day Trial</Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => setShowTutorial(true)}>See How It Works</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 bg-[var(--color-primary)] px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to grow</h2>
            <p className="text-[var(--color-muted)]">Powerful tools designed for the reality of running a business in Nigeria.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<WifiOff className="h-8 w-8 text-[var(--color-accent)]" />}
              title="Works Offline"
              description="Sell and manage inventory even without internet. Everything syncs automatically when you reconnect."
            />
            <FeatureCard 
              icon={<Smartphone className="h-8 w-8 text-[var(--color-accent)]" />}
              title="Install Like an App"
              description="Add PosNaija to your POS machine, phone, or tablet from your browser. No app store needed."
            />
            <FeatureCard 
              icon={<Receipt className="h-8 w-8 text-[var(--color-accent)]" />}
              title="Track Debts Easily"
              description="Record credit sales and track who owes you. Send WhatsApp reminders with one tap."
            />
            <FeatureCard 
              icon={<MessageSquare className="h-8 w-8 text-[var(--color-accent)]" />}
              title="WhatsApp Receipts"
              description="Share professional receipts directly on WhatsApp after every sale."
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-[var(--color-accent)]" />}
              title="Staff Management"
              description="Add cashiers and managers with PIN-based login. Control what each staff member can access."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-[var(--color-accent)]" />}
              title="Sales Analytics"
              description="View your revenue, profit, and best-selling products at a glance."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 text-center px-4">
        <div className="container mx-auto max-w-2xl space-y-8 bg-[var(--color-surface)] p-12 rounded-2xl border border-[var(--color-accent)]/20 shadow-2xl shadow-[var(--color-accent)]/5">
          <h2 className="text-3xl font-bold">Ready to grow your business?</h2>
          <p className="text-[var(--color-muted)]">Join hundreds of Nigerian businesses using PosNaija today.</p>
          <Link to="/auth/register" className="inline-block mt-4">
            <Button size="lg">Get Started Free — No Credit Card</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-[var(--color-surface)]/50 border-none transition-all hover:bg-[var(--color-surface)]">
      <CardHeader>
        <div className="mb-4 bg-[var(--color-background)] w-14 h-14 rounded-xl flex items-center justify-center border border-[var(--color-muted)]/10 shadow-inner">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[var(--color-muted)] leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
