-- Create the articles table
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
  token_usage JSONB,
  drive_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Allow public access for now as requested (can be refined later)
CREATE POLICY "Public Read Access" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON public.articles FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON public.articles FOR DELETE USING (true);
