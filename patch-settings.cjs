const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

const targetState = `  const [businessForm, setBusinessForm] = useState({
    business_name: '',
    business_address: '',
    business_phone: '',
    whatsapp_number: ''
  });`;
const replacementState = `  const [businessForm, setBusinessForm] = useState({
    business_name: '',
    business_address: '',
    business_phone: '',
    whatsapp_number: '',
    custom_theme_primary: '',
    custom_theme_accent: '',
    custom_theme_background: '',
    custom_theme_surface: '',
    custom_theme_brand_name: ''
  });`;
code = code.replace(targetState, replacementState);

const targetEffect = `    if (session) {
      setBusinessForm({
        business_name: session.business_name || '',
        business_address: session.business_address || '',
        business_phone: session.business_phone || '',
        whatsapp_number: session.whatsapp_number || ''
      });
    }`;
const replacementEffect = `    if (session) {
      setBusinessForm({
        business_name: session.business_name || '',
        business_address: session.business_address || '',
        business_phone: session.business_phone || '',
        whatsapp_number: session.whatsapp_number || '',
        custom_theme_primary: session.custom_theme_primary || '',
        custom_theme_accent: session.custom_theme_accent || '',
        custom_theme_background: session.custom_theme_background || '',
        custom_theme_surface: session.custom_theme_surface || '',
        custom_theme_brand_name: session.custom_theme_brand_name || ''
      });
    }`;
code = code.replace(targetEffect, replacementEffect);

// Look for where to insert the new settings. Let's put it in the business section if Pro
const targetBusinessInputs = `              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">WhatsApp Number</label>
                <Input 
                  value={businessForm.whatsapp_number} 
                  onChange={e => setBusinessForm({...businessForm, whatsapp_number: e.target.value})} 
                />
              </div>
            </div>`;
const replacementBusinessInputs = `              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">WhatsApp Number</label>
                <Input 
                  value={businessForm.whatsapp_number} 
                  onChange={e => setBusinessForm({...businessForm, whatsapp_number: e.target.value})} 
                />
              </div>
            </div>
            
            {(session.plan === 'pro' || session.plan === 'lifetime') && (
              <div className="mt-6 pt-6 border-t border-[var(--color-muted)]/10">
                <h3 className="font-semibold text-lg mb-4 text-[var(--color-accent)]">White-Label Customization (Pro)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[var(--color-muted)] block mb-1">Custom Brand Name</label>
                    <Input 
                      placeholder="e.g. MyStore POS"
                      value={businessForm.custom_theme_brand_name} 
                      onChange={e => setBusinessForm({...businessForm, custom_theme_brand_name: e.target.value})} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[var(--color-muted)] block mb-1">Primary Color</label>
                      <input 
                        type="color"
                        className="w-full h-10 rounded cursor-pointer bg-transparent border-0"
                        value={businessForm.custom_theme_primary || '#1A1A2E'} 
                        onChange={e => setBusinessForm({...businessForm, custom_theme_primary: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[var(--color-muted)] block mb-1">Accent Color</label>
                      <input 
                        type="color"
                        className="w-full h-10 rounded cursor-pointer bg-transparent border-0"
                        value={businessForm.custom_theme_accent || '#D4AF37'} 
                        onChange={e => setBusinessForm({...businessForm, custom_theme_accent: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[var(--color-muted)] block mb-1">Background Color</label>
                      <input 
                        type="color"
                        className="w-full h-10 rounded cursor-pointer bg-transparent border-0"
                        value={businessForm.custom_theme_background || '#12121E'} 
                        onChange={e => setBusinessForm({...businessForm, custom_theme_background: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[var(--color-muted)] block mb-1">Surface Color</label>
                      <input 
                        type="color"
                        className="w-full h-10 rounded cursor-pointer bg-transparent border-0"
                        value={businessForm.custom_theme_surface || '#1E1E35'} 
                        onChange={e => setBusinessForm({...businessForm, custom_theme_surface: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}`;
code = code.replace(targetBusinessInputs, replacementBusinessInputs);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
