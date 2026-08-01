const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

const importTarget = `import { useState } from 'react';`;
const importReplacement = `import { useState, useEffect } from 'react';`;
if (code.includes(importTarget) && !code.includes('useEffect } from \'react\'')) {
  // It's probably already imported
}

const componentStartTarget = `  const [upgrading, setUpgrading] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');`;
const componentStartReplacement = `  const [upgrading, setUpgrading] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    business_name: '',
    business_address: '',
    business_phone: '',
    whatsapp_number: ''
  });

  useEffect(() => {
    if (session) {
      setBusinessForm({
        business_name: session.business_name || '',
        business_address: session.business_address || '',
        business_phone: session.business_phone || '',
        whatsapp_number: session.whatsapp_number || ''
      });
    }
  }, [session]);

  const handleSaveBusiness = async () => {
    try {
      // Update local db
      await db.session.update(session.id, businessForm);
      // Try to update remote if online
      if (navigator.onLine && session.admin_id) {
        await supabase
          .from('profiles')
          .update(businessForm)
          .eq('id', session.admin_id);
      }
      setIsEditingBusiness(false);
      alert('Business profile updated successfully!');
      window.location.reload(); // Refresh to reflect changes everywhere
    } catch (e) {
      console.error(e);
      alert('Failed to update business profile');
    }
  };`;

code = code.replace(componentStartTarget, componentStartReplacement);

const businessProfileSectionTarget = `<h2 className="text-xl font-semibold border-b border-[var(--color-muted)]/10 pb-2">Business Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Business Name</p>
              <p className="font-medium text-lg">{session.business_name}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)]">Admin Email</p>
              <p className="font-medium text-lg">{session.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)]">Role</p>
              <p className="font-medium text-lg uppercase">{session.role}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)]">Current Plan</p>
              <p className="font-medium text-lg uppercase text-[var(--color-accent)]">{session.plan || 'Free'}</p>
            </div>
          </div>`;

const businessProfileSectionReplacement = `<div className="flex justify-between items-center border-b border-[var(--color-muted)]/10 pb-2">
            <h2 className="text-xl font-semibold">Business Profile</h2>
            {!isEditingBusiness ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditingBusiness(true)}>Edit Info</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingBusiness(false)}>Cancel</Button>
                <Button size="sm" className="bg-[var(--color-accent)] text-[var(--color-primary)]" onClick={handleSaveBusiness}>Save</Button>
              </div>
            )}
          </div>
          
          {isEditingBusiness ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">Business Name</label>
                <Input 
                  value={businessForm.business_name} 
                  onChange={e => setBusinessForm({...businessForm, business_name: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">Business Address</label>
                <Input 
                  value={businessForm.business_address} 
                  onChange={e => setBusinessForm({...businessForm, business_address: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">Business Phone</label>
                <Input 
                  value={businessForm.business_phone} 
                  onChange={e => setBusinessForm({...businessForm, business_phone: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-muted)] block mb-1">WhatsApp Number</label>
                <Input 
                  value={businessForm.whatsapp_number} 
                  onChange={e => setBusinessForm({...businessForm, whatsapp_number: e.target.value})} 
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Business Name</p>
                <p className="font-medium text-lg">{session.business_name}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">Address</p>
                <p className="font-medium text-lg">{session.business_address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">Phone / WhatsApp</p>
                <p className="font-medium text-lg">{session.business_phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">Admin Email</p>
                <p className="font-medium text-lg">{session.email || 'N/A'}</p>
              </div>
            </div>
          )}`;

code = code.replace(businessProfileSectionTarget, businessProfileSectionReplacement);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
