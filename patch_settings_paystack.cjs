const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

if (!code.includes('PaystackButton')) {
  code = code.replace(
    "import { useState } from 'react';",
    "import { useState } from 'react';\nimport { PaystackButton } from 'react-paystack';"
  );
}

const paystackButtonRender = `
                <div className="p-6 pt-4 bg-[var(--color-surface)]">
                  {isCurrent ? (
                    <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                  ) : plan.id === 'free' ? (
                    <Button className="w-full" variant="primary" onClick={() => handleUpgrade('free')}>Downgrade to Free</Button>
                  ) : (
                    <PaystackButton
                      className="flex h-10 w-full items-center justify-center rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 transition-colors"
                      text="Upgrade"
                      reference={(new Date()).getTime().toString()}
                      email={session.email || 'customer@posnaija.com'}
                      amount={parseInt(plan.price.replace(/[^0-9]/g, ''), 10) * 100}
                      publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_b867c0500f40fb17849e75cfa7975f284e3c9886'}
                      onSuccess={(ref) => handleUpgrade(plan.id as any)}
                      onClose={() => console.log('Payment closed')}
                    />
                  )}
                </div>
`;

code = code.replace(
  /<div className="p-6 pt-4 bg-\[var\(--color-surface\)\]">[\s\S]*?<\/div>/,
  paystackButtonRender
);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
