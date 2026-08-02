const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/DashboardLayout.tsx', 'utf8');

const target1 = `  const hasBasicPlan = session.plan !== 'free';
  const hasProPlan = session.plan === 'pro' || session.plan === 'lifetime';

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col text-[var(--color-text)]">`;

const replacement1 = `  const hasBasicPlan = session.plan !== 'free';
  const hasProPlan = session.plan === 'pro' || session.plan === 'lifetime';

  const themeStyle = hasProPlan ? {
    ...(session.custom_theme_primary ? { '--color-primary': session.custom_theme_primary } : {}),
    ...(session.custom_theme_accent ? { '--color-accent': session.custom_theme_accent } : {}),
    ...(session.custom_theme_background ? { '--color-background': session.custom_theme_background } : {}),
    ...(session.custom_theme_surface ? { '--color-surface': session.custom_theme_surface } : {}),
  } as React.CSSProperties : undefined;

  const brandName = (hasProPlan && session.custom_theme_brand_name) 
    ? <span className="font-bold text-xl">{session.custom_theme_brand_name}</span>
    : <span className="font-normal text-xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>;
    
  const desktopBrandName = (hasProPlan && session.custom_theme_brand_name) 
    ? <span className="font-bold text-2xl">{session.custom_theme_brand_name}</span>
    : <span className="font-normal text-2xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>;

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col text-[var(--color-text)]" style={themeStyle}>`;
code = code.replace(target1, replacement1);

const targetMobileLogo = `<span className="font-normal text-xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>`;
code = code.replace(targetMobileLogo, '{brandName}');

const targetDesktopLogo = `<span className="font-normal text-2xl">Pos<span className="font-bold text-[var(--color-accent)]">Naija</span></span>`;
code = code.replace(targetDesktopLogo, '{desktopBrandName}');

fs.writeFileSync('src/pages/dashboard/DashboardLayout.tsx', code);
