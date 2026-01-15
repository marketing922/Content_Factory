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
    const evaluation = {
        global_score: 100,
        criteria: [
            { name: "Clarté", score: 25, explanation: "Structure logique et vocabulaire accessible." },
            { name: "Pertinence", score: 25, explanation: "Répond parfaitement à l'intention de recherche." },
            { name: "Engagement", score: 25, explanation: "Ton captivant avec des accroches efficaces." },
            { name: "SEO", score: 25, explanation: "Mots-clés optimisés et balisage sémantique correct." }
        ]
    };

    const { error } = await supabase
        .from('articles')
        .update({ evaluation_details: evaluation })
        .eq('id', 'f747fe90-dfe2-4c06-853f-eee85de33aa3');

    if (error) console.error(error);
    else console.log('Update success');
}

run();
