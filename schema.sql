-- Supabase schema for Maulinondh

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Varkaris Table
CREATE TABLE public.varkaris (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  registration_id TEXT UNIQUE NOT NULL,
  qr_token TEXT UNIQUE,
  name TEXT NOT NULL,
  photo_url TEXT,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  
  -- Medical
  blood_group TEXT NOT NULL,
  medical_conditions TEXT,
  medications TEXT,
  allergies TEXT,
  additional_medical_information TEXT,
  
  -- Emergency Contact
  guardian_name TEXT NOT NULL,
  guardian_relationship TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,
  secondary_guardian_name TEXT,
  secondary_guardian_phone TEXT,
  
  -- Wari info
  participating_with TEXT NOT NULL,
  dindi_name TEXT,
  dindi_id UUID, -- For future dindi tables
  team_leader_id UUID REFERENCES public.team_leaders(id),
  team_leader_user_id UUID REFERENCES auth.users(id),
  starting_location TEXT,
  starting_latitude DOUBLE PRECISION,
  starting_longitude DOUBLE PRECISION,
  starting_place_id TEXT,
  destination TEXT NOT NULL DEFAULT 'पंढरपूर',
  
  -- Live Location Info
  current_latitude DOUBLE PRECISION,
  current_longitude DOUBLE PRECISION,
  location_updated_at TIMESTAMP WITH TIME ZONE,
  
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Dindis Table (placeholder for future extensibility)
CREATE TABLE public.dindis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  leader_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Incidents Table (placeholder for future extensibility)
CREATE TABLE public.incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  varkari_id UUID REFERENCES public.varkaris(id),
  reported_by TEXT, -- not a foreign key as per requirements
  assigned_to UUID REFERENCES auth.users(id),
  description TEXT,
  status TEXT DEFAULT 'OPEN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Orders Table (placeholder for future extensibility)
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  varkari_id UUID REFERENCES public.varkaris(id),
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- NFC Tags Table (placeholder for future extensibility)
CREATE TABLE public.nfc_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  varkari_id UUID REFERENCES public.varkaris(id),
  tag_uid TEXT UNIQUE,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS) Policies

ALTER TABLE public.varkaris ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dindis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_tags ENABLE ROW LEVEL SECURITY;

-- Varkaris Policies
-- 1. Users can read their own varkari profile
CREATE POLICY "Users can view own varkari profile"
  ON public.varkaris FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Users can insert their own varkari profile
CREATE POLICY "Users can insert own varkari profile"
  ON public.varkaris FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own varkari profile (except status, etc. in real world, but kept simple here)
CREATE POLICY "Users can update own varkari profile"
  ON public.varkaris FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Team Leaders can view own team members
CREATE POLICY "Team Leaders can view own team members"
  ON public.varkaris FOR SELECT
  USING (auth.uid() = team_leader_user_id);

-- 5. Team Leaders can insert own team members
CREATE POLICY "Team Leaders can insert own team members"
  ON public.varkaris FOR INSERT
  WITH CHECK (auth.uid() = team_leader_user_id);

-- 6. Team Leaders can update own team members
CREATE POLICY "Team Leaders can update own team members"
  ON public.varkaris FOR UPDATE
  USING (auth.uid() = team_leader_user_id);

-- Note: Admin/Police/Medical roles would be implemented here for real usage, e.g., 
-- CREATE POLICY "Admins can do everything" ON public.varkaris FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- Allow public inserts for registration if they don't have user_id yet (optional depending on exact auth flow)
-- For this setup, we assume they register/login to Supabase Auth first, then create Varkari record.

-- Gram Panchayats Table
CREATE TABLE public.gram_panchayats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  registration_id TEXT UNIQUE NOT NULL,
  
  -- Panchayat Info
  panchayat_name TEXT NOT NULL,
  village_name TEXT NOT NULL,
  taluka TEXT NOT NULL,
  district TEXT NOT NULL,
  office_address TEXT NOT NULL,
  pincode TEXT,
  official_contact TEXT NOT NULL,
  official_email TEXT,
  registration_id_gov TEXT,
  
  -- Authority Contact
  primary_contact_name TEXT NOT NULL,
  primary_designation TEXT NOT NULL,
  primary_contact_number TEXT NOT NULL,
  primary_email TEXT,
  alternate_contact_name TEXT,
  alternate_contact_number TEXT,
  
  -- Route Info
  wari_route TEXT,
  starting_point TEXT,
  major_checkpoint TEXT,
  destination TEXT,
  medical_facility BOOLEAN DEFAULT false,
  drinking_water BOOLEAN DEFAULT false,
  toilet_facility BOOLEAN DEFAULT false,
  emergency_control_room TEXT,
  
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Team Leaders Table
CREATE TABLE public.team_leaders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  registration_id TEXT UNIQUE NOT NULL,
  generated_password TEXT,

  
  -- Leader Info
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT,
  age INTEGER,
  address TEXT,
  village TEXT,
  district TEXT,
  
  -- Team Info
  team_name TEXT NOT NULL,
  team_id TEXT,
  team_size INTEGER,
  starting_location TEXT,
  destination TEXT,
  wari_route TEXT,
  dindi_identifier TEXT,
  group_description TEXT,
  
  -- Emergency Info
  emergency_contact_name TEXT,
  emergency_contact_number TEXT,
  alternate_contact_name TEXT,
  alternate_contact_number TEXT,
  
  -- Coordination Info
  main_coordinator_name TEXT,
  coordinator_phone TEXT,
  meeting_location TEXT,
  preferred_communication TEXT,
  notes TEXT,
  
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS for new tables
ALTER TABLE public.gram_panchayats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_leaders ENABLE ROW LEVEL SECURITY;

-- Gram Panchayats Policies
CREATE POLICY "Users can view own gram_panchayat profile"
  ON public.gram_panchayats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gram_panchayat profile"
  ON public.gram_panchayats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gram_panchayat profile"
  ON public.gram_panchayats FOR UPDATE
  USING (auth.uid() = user_id);

-- Team Leaders Policies
CREATE POLICY "Users can view own team_leader profile"
  ON public.team_leaders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own team_leader profile"
  ON public.team_leaders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own team_leader profile"
  ON public.team_leaders FOR UPDATE
  USING (auth.uid() = user_id);
