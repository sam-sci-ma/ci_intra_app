-- Fix Row Level Security for events table and staff_profiles
-- Run this in your Supabase SQL Editor

-- =============================================
-- STEP 1: Create staff_profiles table if it doesn't exist
-- =============================================
CREATE TABLE IF NOT EXISTS staff_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STEP 2: Enable RLS on both tables
-- =============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 3: Drop existing policies
-- =============================================
DROP POLICY IF EXISTS "events_select_all_auth" ON events;
DROP POLICY IF EXISTS "events_select_public" ON events;
DROP POLICY IF EXISTS "events_insert_auth" ON events;
DROP POLICY IF EXISTS "events_update_owner" ON events;
DROP POLICY IF EXISTS "events_delete_owner" ON events;

DROP POLICY IF EXISTS "staff_profiles_select_public" ON staff_profiles;
DROP POLICY IF EXISTS "staff_profiles_select_auth" ON staff_profiles;
DROP POLICY IF EXISTS "staff_profiles_update_own" ON staff_profiles;

-- =============================================
-- STEP 4: Events Table Policies
-- =============================================

-- Read: PUBLIC (anon) and authenticated users can see all events
CREATE POLICY "events_select_public"
ON events FOR SELECT
TO anon, authenticated
USING (true);

-- Insert: authenticated users can create events; must record creator
CREATE POLICY "events_insert_auth"
ON events FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Update: only the creator (or events without a creator) can edit
CREATE POLICY "events_update_owner"
ON events FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR created_by IS NULL)
WITH CHECK (created_by = auth.uid() OR created_by IS NULL);

-- Delete: only the creator (or events without a creator) can delete
CREATE POLICY "events_delete_owner"
ON events FOR DELETE
TO authenticated
USING (created_by = auth.uid() OR created_by IS NULL);

-- =============================================
-- STEP 5: Staff Profiles Table Policies
-- =============================================

-- Read: PUBLIC (anon) and authenticated can view staff profiles (for creator names)
CREATE POLICY "staff_profiles_select_public"
ON staff_profiles FOR SELECT
TO anon, authenticated
USING (true);

-- Update: users can only update their own profile
CREATE POLICY "staff_profiles_update_own"
ON staff_profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- =============================================
-- STEP 6: Create trigger to auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.staff_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- STEP 7: Backfill existing users into staff_profiles
-- =============================================
INSERT INTO staff_profiles (id, email, full_name)
SELECT 
  id, 
  email,
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM staff_profiles)
ON CONFLICT (id) DO NOTHING;
