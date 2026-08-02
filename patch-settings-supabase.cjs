const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

const target = `        await supabase
          .from('profiles')
          .update(businessForm)
          .eq('id', session.admin_id);`;
          
const replacement = `        const { custom_theme_primary, custom_theme_accent, custom_theme_background, custom_theme_surface, custom_theme_brand_name, ...supabaseData } = businessForm;
        await supabase
          .from('profiles')
          .update(supabaseData)
          .eq('id', session.admin_id);`;
          
code = code.replace(target, replacement);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
