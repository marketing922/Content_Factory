
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugArticle() {
  console.log('Fetching latest article...');
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching article:', error);
    return;
  }

  if (articles && articles.length > 0) {
    const article = articles[0];
    const outcome = {
        id: article.id,
        status: article.status,
        language: article.parameters?.language,
        plan_options: article.plan_options,
        toc_title: article.table_of_contents?.title
    };
    fs.writeFileSync('debug_output.json', JSON.stringify(outcome, null, 2));
    console.log('Output written to debug_output.json');
  } else {
    console.log('No articles found.');
  }
}

debugArticle();
