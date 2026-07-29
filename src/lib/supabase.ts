import { createClient } from '@supabase/supabase-js';

// Fallback to empty string for build time, will be checked at runtime
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'
);
