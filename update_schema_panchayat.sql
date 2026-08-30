-- update_schema_panchayat.sql

-- 1. Add new columns to existing varkaris table
ALTER TABLE public.varkaris 
ADD COLUMN IF NOT EXISTS gram_panchayat_id UUID REFERENCES public.gram_panchayats(id),
ADD COLUMN IF NOT EXISTS gram_panchayat_user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS default_safety_contact_name TEXT,
ADD COLUMN IF NOT EXISTS default_safety_contact_phone TEXT;

-- 2. Add Gram Panchayat RLS Policies for varkaris
DROP POLICY IF EXISTS "Gram Panchayats can view own varkaris" ON public.varkaris;
CREATE POLICY "Gram Panchayats can view own varkaris" ON public.varkaris FOR SELECT USING (auth.uid() = gram_panchayat_user_id);

DROP POLICY IF EXISTS "Gram Panchayats can insert own varkaris" ON public.varkaris;
CREATE POLICY "Gram Panchayats can insert own varkaris" ON public.varkaris FOR INSERT WITH CHECK (auth.uid() = gram_panchayat_user_id);

DROP POLICY IF EXISTS "Gram Panchayats can update own varkaris" ON public.varkaris;
CREATE POLICY "Gram Panchayats can update own varkaris" ON public.varkaris FOR UPDATE USING (auth.uid() = gram_panchayat_user_id);
