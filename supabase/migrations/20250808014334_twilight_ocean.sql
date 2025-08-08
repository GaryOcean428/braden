/*
  # Apply RLS Policy for Media Table

  This migration fixes the "permission denied to set role 'admin'" error by:
  
  1. New Policies
    - Allow developer admin to select media based on email verification
    - Simple policy using only auth.email() function to avoid role escalation
  
  2. Security
    - Enable RLS on media table
    - Drop any existing conflicting policies
    - Grant explicit table permissions
*/

-- Enable RLS on the media table
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on the media table to avoid conflicts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'media') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.media;';
    END LOOP;
END $$;

-- Create a simple policy to allow SELECT access only for the developer admin
CREATE POLICY "Allow developer admin to select media"
ON public.media
FOR SELECT
USING (auth.email() = 'braden.lang77@gmail.com');

-- Grant explicit table permissions to ensure access
GRANT SELECT ON public.media TO authenticated;
GRANT SELECT ON public.media TO anon;

-- Create policies for other operations if needed (keeping them simple)
CREATE POLICY "Allow developer admin to insert media"
ON public.media
FOR INSERT
WITH CHECK (auth.email() = 'braden.lang77@gmail.com');

CREATE POLICY "Allow developer admin to update media"
ON public.media
FOR UPDATE
USING (auth.email() = 'braden.lang77@gmail.com');

CREATE POLICY "Allow developer admin to delete media"
ON public.media
FOR DELETE
USING (auth.email() = 'braden.lang77@gmail.com');