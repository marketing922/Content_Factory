const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid dotenv issues
const envPath = path.resolve(__dirname, '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('--- Checking N8N Env Vars ---');
    console.log('RESEARCH_URL:', env.N8N_WEBHOOK_RESEARCH_URL || 'MISSING');
    console.log('DRIVE_URL:', env.N8N_WEBHOOK_DRIVE_URL || 'MISSING');
    
    console.log('\n--- Fetching Article ---');
    const { data, error } = await supabase
        .from('articles')
        .select('content, evaluation_details, score')
        .eq('id', 'f747fe90-dfe2-4c06-853f-eee85de33aa3')
        .single();
    
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Score:', data.score);
        console.log('Evaluation Details Present:', !!data.evaluation_details);
        console.log('Content Length:', data.content ? data.content.length : 0);
        console.log('Content Preview (First 200 chars):');
        console.log(data.content ? data.content.substring(0, 200) : 'NULL');
        console.log('Content Preview (Last 200 chars):');
        console.log(data.content ? data.content.substring(data.content.length - 200) : 'NULL');
    }
}

inspect();
