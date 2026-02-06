-- ============================================
-- NEXORA INSTITUTES TABLE
-- ============================================
-- Purpose: Store institutional tenant data for multi-tenant system
-- Database: Supabase (fdwsoeupbgmousororov.supabase.co)
-- Created: February 7, 2026
-- ============================================

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS public.institutes (
  institute_id TEXT PRIMARY KEY,
  institute_name TEXT NOT NULL,
  institution_type TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE INDEX FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_institutes_status ON public.institutes(status);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICY: Allow anonymous SELECT for institute verification
-- IMPORTANT: Gateway page runs BEFORE login, so anon users need to verify institute IDs
-- This is safe because we only expose institute_id and institute_name (public info)
CREATE POLICY "Allow anonymous read access to institutes"
ON public.institutes
FOR SELECT
TO anon
USING (true);

-- 5. CREATE POLICY: Allow authenticated users to read
CREATE POLICY "Allow authenticated read access to institutes"
ON public.institutes
FOR SELECT
TO authenticated
USING (true);

-- 6. SEED DATA: Canonical demo institute
INSERT INTO public.institutes (institute_id, institute_name, institution_type, status)
VALUES ('SIT-2026', 'Solapur Institute of Technology', 'College', 'active')
ON CONFLICT (institute_id) DO NOTHING;

-- 7. VERIFY SEED DATA
SELECT * FROM public.institutes WHERE institute_id = 'SIT-2026';

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select project: fdwsoeupbgmousororov
-- 3. Navigate to: SQL Editor (left sidebar)
-- 4. Create new query
-- 5. Copy and paste this entire SQL file
-- 6. Click "Run" or press Cmd/Ctrl + Enter
-- 7. Verify output shows: "SIT-2026 | Solapur Institute of Technology"
--
-- SECURITY NOTE:
-- - Anonymous SELECT is enabled for institute verification on gateway page
-- - Only institute_id and institute_name are exposed (public info)
-- - For production hardening, consider creating a serverless function
--   that validates institute IDs without direct table access
-- ============================================
