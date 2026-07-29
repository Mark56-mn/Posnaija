import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    business_address: '',
    business_phone: '',
    whatsapp_number: '',
    pin: ''
  });

  const handleComplete = async () => {
    const session = await db.session.get(1);
    if (!session) return;

    // Update Supabase
    if (navigator.onLine) {
      await supabase.from('profiles').update({
        business_address: formData.business_address,
        business_phone: formData.business_phone,
        whatsapp_number: formData.whatsapp_number,
        onboarding_completed: true
      }).eq('id', session.admin_id);
      
      if (formData.pin) {
        localStorage.setItem('admin_pin', formData.pin); // Basic implementation for PIN
      }
    }

    // Update Dexie
    await db.session.update(1, { onboarding_completed: true });
    
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)]">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Welcome to PosNaija!</h1>
            <p className="text-[var(--color-muted)] mt-2">Let's set up your business profile.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Business Address</label>
              <Input value={formData.business_address} onChange={e => setFormData({...formData, business_address: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Business Phone</label>
              <Input value={formData.business_phone} onChange={e => setFormData({...formData, business_phone: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">WhatsApp Number</label>
              <Input value={formData.whatsapp_number} onChange={e => setFormData({...formData, whatsapp_number: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Quick Login PIN (Optional)</label>
              <Input type="password" maxLength={6} value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} placeholder="4-6 digits" />
            </div>

            <Button onClick={handleComplete} className="w-full h-12 mt-6">Complete Setup</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
