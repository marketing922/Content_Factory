-- Enable Realtime for the articles table
-- Run this in the Supabase SQL Editor

-- 1. Create the publication if it doesn't exist
-- DO NOT RUN if you already have a publication named 'supabase_realtime'
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;

-- 2. Enable REPLICA IDENTITY FULL to get all columns in the payload (optional but recommended for complex JSON)
ALTER TABLE public.articles REPLICA IDENTITY FULL;

-- 3. In the Supabase Dashboard:
-- Go to Database -> Replication -> supabase_realtime
-- Toggle 'Source' for the 'articles' table to ON.
