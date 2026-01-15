
const { Client } = require('pg');

require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.warn('Warning: SUPABASE_DB_URL is not defined. Skipping DB setup.');
  process.exit(0); // Exit gracefully during build to avoid failure if variable is missing
}

const client = new Client({
  connectionString: connectionString,
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.articles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID,
        topic TEXT NOT NULL,
        parameters JSONB,
        status TEXT DEFAULT 'draft',
        table_of_contents JSONB,
        content TEXT,
        score INT,
        evaluation_details JSONB,
        drive_link TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await client.query(createTableQuery);
    console.log("Table 'articles' created or already exists.");

    // Enable Realtime
    const enableRealtimeQuery = `
      ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
    `;
    
    // Check if table is already in publication to avoid error
    // Simple try/catch for duplicates
    try {
        await client.query(enableRealtimeQuery);
        console.log("Realtime enabled for 'articles'.");
    } catch (err) {
        if (err.code === '42710') { // duplicate_object
             console.log("Realtime already enabled for 'articles'.");
        } else {
            console.log("Note on Realtime: " + err.message);
        }
    }

  } catch (err) {
    console.error('Database setup error:', err);
  } finally {
    await client.end();
  }
}

setupDatabase();
