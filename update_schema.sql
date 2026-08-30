-- 1. Add new columns to existing varkaris table
ALTER TABLE public.varkaris 
ADD COLUMN IF NOT EXISTS team_leader_id UUID,
ADD COLUMN IF NOT EXISTS team_leader_user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS current_latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS current_longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP WITH TIME ZONE;

-- 2. Create Gram Panchayats Table (if not exists)
CREATE TABLE IF NOT EXISTS public.gram_panchayats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  registration_id TEXT UNIQUE NOT NULL,
  
  panchayat_name TEXT NOT NULL,
  village_name TEXT NOT NULL,
  taluka TEXT NOT NULL,
  district TEXT NOT NULL,
  office_address TEXT NOT NULL,
  pincode TEXT,
  official_contact TEXT NOT NULL,
  official_email TEXT,
  registration_id_gov TEXT,
  
  primary_contact_name TEXT NOT NULL,
  primary_designation TEXT NOT NULL,
  primary_contact_number TEXT NOT NULL,
  primary_email TEXT,
  alternate_contact_name TEXT,
  alternate_contact_number TEXT,
  
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

-- 3. Create Team Leaders Table (if not exists)
CREATE TABLE IF NOT EXISTS public.team_leaders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  registration_id TEXT UNIQUE NOT NULL,
  generated_password TEXT,
  
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT,
  age INTEGER,
  address TEXT,
  village TEXT,
  district TEXT,
  
  team_name TEXT NOT NULL,
  team_id TEXT,
  team_size INTEGER,
  starting_location TEXT,
  destination TEXT,
  wari_route TEXT,
  dindi_identifier TEXT,
  group_description TEXT,
  
  emergency_contact_name TEXT,
  emergency_contact_number TEXT,
  alternate_contact_name TEXT,
  alternate_contact_number TEXT,
  
  main_coordinator_name TEXT,
  coordinator_phone TEXT,
  meeting_location TEXT,
  preferred_communication TEXT,
  notes TEXT,
  
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Add Foreign Key for team_leader_id in varkaris now that team_leaders exists
-- (Safe to run multiple times by checking if constraint exists, or just skip if it causes error. We will just add it directly)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'varkaris_team_leader_id_fkey') THEN
        ALTER TABLE public.varkaris ADD CONSTRAINT varkaris_team_leader_id_fkey FOREIGN KEY (team_leader_id) REFERENCES public.team_leaders(id);
    END IF;
END;
$$;

-- 5. Enable RLS on new tables
ALTER TABLE public.gram_panchayats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_leaders ENABLE ROW LEVEL SECURITY;

-- 6. Add new RLS Policies for varkaris (Team Leaders)
-- We drop them first just in case they already exist to avoid errors
DROP POLICY IF EXISTS "Team Leaders can view own team members" ON public.varkaris;
CREATE POLICY "Team Leaders can view own team members" ON public.varkaris FOR SELECT USING (auth.uid() = team_leader_user_id);

DROP POLICY IF EXISTS "Team Leaders can insert own team members" ON public.varkaris;
CREATE POLICY "Team Leaders can insert own team members" ON public.varkaris FOR INSERT WITH CHECK (auth.uid() = team_leader_user_id);

DROP POLICY IF EXISTS "Team Leaders can update own team members" ON public.varkaris;
CREATE POLICY "Team Leaders can update own team members" ON public.varkaris FOR UPDATE USING (auth.uid() = team_leader_user_id);

-- 7. Add Policies for Gram Panchayats
DROP POLICY IF EXISTS "Users can view own gram_panchayat profile" ON public.gram_panchayats;
CREATE POLICY "Users can view own gram_panchayat profile" ON public.gram_panchayats FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own gram_panchayat profile" ON public.gram_panchayats;
CREATE POLICY "Users can insert own gram_panchayat profile" ON public.gram_panchayats FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own gram_panchayat profile" ON public.gram_panchayats;
CREATE POLICY "Users can update own gram_panchayat profile" ON public.gram_panchayats FOR UPDATE USING (auth.uid() = user_id);

-- 8. Add Policies for Team Leaders
DROP POLICY IF EXISTS "Users can view own team_leader profile" ON public.team_leaders;
CREATE POLICY "Users can view own team_leader profile" ON public.team_leaders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own team_leader profile" ON public.team_leaders;
CREATE POLICY "Users can insert own team_leader profile" ON public.team_leaders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own team_leader profile" ON public.team_leaders;
CREATE POLICY "Users can update own team_leader profile" ON public.team_leaders FOR UPDATE USING (auth.uid() = user_id);
