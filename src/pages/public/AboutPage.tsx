import React from 'react';
import { Store, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl">
          About PosNaija
        </h1>
        <p className="mt-4 text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
          Empowering Nigerian businesses with modern, offline-first point of sale technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold mb-4">Built for the realities of Nigerian business</h2>
          <p className="text-lg text-[var(--color-muted)] mb-6">
            We understand the challenges of running a retail business in Nigeria. From unstable internet connections to power outages, standard cloud-based POS systems often fail when you need them most.
          </p>
          <p className="text-lg text-[var(--color-muted)]">
            That's why we built PosNaija to be truly offline-first. Your business keeps running, taking sales, and managing inventory even when the network is down, securely syncing to the cloud when connection is restored.
          </p>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 rounded-2xl p-8 shadow-xl">
          <div className="aspect-video bg-[var(--color-background)] rounded-lg flex items-center justify-center">
             <Store className="h-24 w-24 text-[var(--color-accent)] opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-muted)]/10 rounded-xl shadow-sm">
          <div className="bg-[var(--color-accent)]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
            <Zap className="h-6 w-6 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-xl font-bold mb-3">Offline-First</h3>
          <p className="text-[var(--color-muted)]">
            Keep selling without internet. PosNaija stores data locally and syncs automatically in the background when you're back online.
          </p>
        </div>
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-muted)]/10 rounded-xl shadow-sm">
          <div className="bg-[var(--color-accent)]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
            <ShieldCheck className="h-6 w-6 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
          <p className="text-[var(--color-muted)]">
            Your data is encrypted and securely backed up to the cloud. Role-based access ensures staff only see what they need to see.
          </p>
        </div>
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-muted)]/10 rounded-xl shadow-sm">
          <div className="bg-[var(--color-accent)]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
            <Store className="h-6 w-6 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-xl font-bold mb-3">Multi-Branch Ready</h3>
          <p className="text-[var(--color-muted)]">
            Manage multiple store locations from a single dashboard. Track inventory and sales across your entire retail empire.
          </p>
        </div>
      </div>
    </div>
  );
}
