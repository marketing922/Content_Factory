-- SQL Migration Script for Content Factory Articles
-- Run this in the Supabase SQL Editor

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS plan_options JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS search_synthesis JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS evaluation_details JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS drive_link TEXT;

-- Verify columns
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'articles';
