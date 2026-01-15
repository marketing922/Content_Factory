
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrate() {
  console.log('Starting migration...');
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_query: `
      ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS sources JSONB;
      ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS plan_options JSONB;
      ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS search_synthesis JSONB;
      ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS evaluation_details JSONB;
      ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS score INTEGER;
      ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS drive_link TEXT;
    `
  });

  if (error) {
    console.error('Migration failed:', error);
    console.log('Note: If "exec_sql" RPC is not found, you might need to run the SQL manually in Supabase Dashboard.');
  } else {
    console.log('Migration successful:', data);
  }
}

migrate();
