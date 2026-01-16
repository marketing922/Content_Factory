
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateSchema() {
  console.log('Updating profiles table schema...');
  
  // Note: RLS might prevent some operations if not using service key
  // But since we want to add columns, we should ideally use the SQL API or a migration
  // Since we don't have a direct SQL executor in the JS client for DDL, 
  // we will try to update a profile and see if it fails, which is not ideal.
  
  // Actually, the user might expect me to just provide the SQL or try to run it.
  // I will try to use the `supabase.rpc` if they have an 'exec' function or similar.
  // Most Supabase projects don't have exec by default.
  
  console.log('Please run the following SQL in your Supabase Dashboard:');
  console.log(`
    ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS language text DEFAULT 'fr',
    ADD COLUMN IF NOT EXISTS notifications_enabled boolean DEFAULT true;
  `);

  process.exit(0);
}

updateSchema();
