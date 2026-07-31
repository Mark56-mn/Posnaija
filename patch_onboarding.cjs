const fs = require('fs');
let code = fs.readFileSync('src/pages/onboarding/OnboardingPage.tsx', 'utf8');

const newUpdate = `
    // Update Supabase
    if (navigator.onLine) {
      const { error } = await supabase.from('profiles').update({
        business_address: formData.business_address,
        business_phone: formData.business_phone,
        whatsapp_number: formData.whatsapp_number,
        onboarding_completed: true
      }).eq('id', session.admin_id);
      
      if (error) {
        console.error("Failed to update profile", error);
        alert("Failed to save profile: " + error.message);
        return; // don't proceed
      }
      
      if (formData.pin) {
        localStorage.setItem('admin_pin', formData.pin); // Basic implementation for PIN
      }
    }
`;

code = code.replace(
  /\/\/ Update Supabase[\s\S]*?localStorage\.setItem\('admin_pin', formData\.pin\); \/\/ Basic implementation for PIN\n      \}\n    \}/,
  newUpdate.trim()
);

fs.writeFileSync('src/pages/onboarding/OnboardingPage.tsx', code);
