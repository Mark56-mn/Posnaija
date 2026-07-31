const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

code = code.replace(
  "import { useState } from 'react';",
  "import { useState } from 'react';\nimport { usePaystackPayment } from 'react-paystack';"
);

const handleUpgradeCode = `
  const handleUpgrade = async (planId: 'free' | 'basic' | 'pro' | 'lifetime') => {
    if (planId === 'free') {
       // Downgrade or just set to free
       await db.session.update(session.id, { plan: planId });
       await supabase.from('subscriptions').update({ plan: planId, status: 'active' }).eq('admin_id', session.admin_id);
       alert(\`Successfully updated to \${planId.toUpperCase()} plan!\`);
       window.location.reload();
       return;
    }

    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const amountInKobo = parseInt(plan.price.replace(/[^0-9]/g, ''), 10) * 100;

    const config = {
      reference: (new Date()).getTime().toString(),
      email: session.email || 'customer@posnaija.com',
      amount: amountInKobo,
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
    };

    const initializePayment = usePaystackPayment(config);

    initializePayment(
      async (reference) => {
        // onSuccess
        setUpgrading(true);
        try {
          await db.session.update(session.id, { plan: planId });
          await supabase.from('subscriptions').update({ plan: planId, status: 'active' }).eq('admin_id', session.admin_id);
          alert(\`Successfully upgraded to \${planId.toUpperCase()} plan!\`);
          window.location.reload();
        } catch (error) {
          console.error(error);
          alert('Upgrade failed to sync, but payment was successful.');
        } finally {
          setUpgrading(false);
        }
      },
      () => {
        // onClose
        console.log('Payment closed');
      }
    );
  };
`;

// Wait, hooks cannot be called inside callbacks (`usePaystackPayment`).
// It should be initialized outside, or we should use the standard `PaystackButton`.
// Or we can dynamically load the Paystack script and call it. Let's just use dynamic script injection or the hook correctly.
// Let's create a custom function for payment using PaystackPop.
