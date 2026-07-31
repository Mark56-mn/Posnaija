import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Fetch profile
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          await db.session.put({
            id: 1,
            admin_id: session.user.id,
            name: profile.business_name,
            email: session.user.email,
            role: profile.role || 'admin',
            business_name: profile.business_name,
            business_address: profile.business_logo || profile.business_address, // Read from logo column workaround
            business_phone: profile.business_phone,
            whatsapp_number: profile.whatsapp_number,
            business_logo: profile.business_logo,
            is_staff: false,
            onboarding_completed: profile.onboarding_completed,
            plan: profile.plan || 'free',
            offline_pin: profile.offline_pin || undefined,
          });
          if (!profile.onboarding_completed) {
            navigate('/onboarding', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          navigate('/onboarding', { replace: true });
        }
      } else {
        navigate('/auth/login', { replace: true });
      }
    });
  }, [navigate]);

  return <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">Verifying...</div>;
}
