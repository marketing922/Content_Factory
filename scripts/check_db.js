
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log('Checking columns in articles table...');
  
  // Try to update a non-existent row with the new columns
  const { error } = await supabase
    .from('articles')
    .update({ 
      plan_options: {}, 
      sources: [] 
    })
    .eq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    if (error.message.includes('column') && error.message.includes('does not exist')) {
      console.log('❌ Error: The columns plan_options or sources do NOT exist.');
      console.log('Message:', error.message);
      process.exit(1);
    } else {
      // If error is row not found or auth, it might still mean columns exist
      console.log('Column check message (not necessarily missing):', error.message);
      console.log('✅ The columns plan_options and sources seem to exist or didn\'t trigger a "column not found" error.');
      process.exit(0);
    }
  } else {
      console.log('✅ No error returned. The columns definitely exist.');
      process.exit(0);
  }
}

checkColumns();
