const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data, error } = await supabase
        .from('articles')
        .select('evaluation_details')
        .eq('id', 'f747fe90-dfe2-4c06-853f-eee85de33aa3')
        .single();

    if (error) {
        console.error(error);
    } else {
        console.log(JSON.stringify(data.evaluation_details, null, 2));
    }
}

run();
