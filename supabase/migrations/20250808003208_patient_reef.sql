/*
  # Reset Media Table RLS Policies

  This migration completely resets the media table RLS policies to eliminate
  the "permission denied to set role 'admin'" error.

  1. Security Reset
    - Disable RLS temporarily
    - Drop ALL existing policies 
    - Re-enable RLS with minimal policies
    - Use only built-in Supabase functions

  2. Simple Access Control
    - Public read access for all media
    - Authenticated write access
    - No custom functions or role escalation
*/

-- Disable RLS temporarily to clean up
ALTER TABLE media DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on media table
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'media'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_rec.policyname || '" ON media';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create the simplest possible policies without any function calls
CREATE POLICY "media_select_public" 
  ON media FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "media_insert_authenticated" 
  ON media FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "media_update_authenticated" 
  ON media FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "media_delete_authenticated" 
  ON media FOR DELETE 
  TO authenticated
  USING (true);

-- Grant basic permissions to ensure access
GRANT SELECT ON media TO public;
GRANT INSERT, UPDATE, DELETE ON media TO authenticated;