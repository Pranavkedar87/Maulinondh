-- Add admin review fields to varkaris (additive only)
ALTER TABLE public.varkaris
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS qr_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS band_issued_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS band_issued_by UUID REFERENCES auth.users(id);

-- Extend orders for QR band lifecycle
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'QR_BAND',
  ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS issued_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS issued_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Force Supabase schema cache refresh
NOTIFY pgrst, 'reload schema';
