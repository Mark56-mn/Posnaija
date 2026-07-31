const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function check() {
  const { error } = await supabase.from('profiles').select('business_address').limit(1);
  console.log("Error selecting business_address:", error);
}

check();
