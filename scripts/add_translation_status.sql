
-- SQL Migration to add translation_status column
-- Run in Supabase SQL Editor

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS translation_status TEXT DEFAULT NULL;

-- Possible values: 'translating', 'error', 'completed', or NULL (default)
-- This allows checking "if translation_status === 'translating'" separately from main status.
