-- Add the missing generated_password column to the gram_panchayats table
ALTER TABLE public.gram_panchayats ADD COLUMN IF NOT EXISTS generated_password TEXT;
