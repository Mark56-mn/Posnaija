const fs = require('fs');
let code = fs.readFileSync('src/pages/auth/LoginPage.tsx', 'utf8');

const target1 = `        plan: profile.plan || 'free',
        offline_pin: profile.offline_pin || undefined,`;
const replacement1 = `        plan: profile.plan || 'free',
        created_at: profile.created_at,
        offline_pin: profile.offline_pin || undefined,`;

code = code.replace(target1, replacement1);

const target2 = `          is_staff: true,
          onboarding_completed: true,
          plan: adminSession?.plan || 'free',`;
const replacement2 = `          is_staff: true,
          onboarding_completed: true,
          plan: adminSession?.plan || 'free',
          created_at: adminSession?.created_at,`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/pages/auth/LoginPage.tsx', code);
