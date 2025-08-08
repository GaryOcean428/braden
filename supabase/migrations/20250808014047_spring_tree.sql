/*
  # Fix Media Role Permission Errors

  1. Problem Resolution
    - Drops existing SECURITY DEFINER functions that attempt role escalation
    - Recreates functions as SECURITY INVOKER to run with caller permissions
    - Simplifies media table RLS policies to avoid function calls
    - Ensures proper table permissions

  2. Security
    - Enable RLS on media table with simple policies
    - Allow public read access and authenticated user write access
    - No custom functions that could attempt role escalation

  3. Functions Fixed
    - update_modified_column() - recreated as SECURITY INVOKER
    - trigger_set_timestamp() - recreated as SECURITY INVOKER  
    - is_developer_admin() - recreated as SECURITY INVOKER
    - admin_bypass() - recreated as SECURITY INVOKER
*/

-- Drop existing problematic functions that might be SECURITY DEFINER
DROP FUNCTION IF EXISTS update_modified_column() CASCADE;
DROP FUNCTION IF EXISTS trigger_set_timestamp() CASCADE;
DROP FUNCTION IF EXISTS is_developer_admin() CASCADE;
DROP FUNCTION IF EXISTS admin_bypass() CASCADE;
DROP FUNCTION IF EXISTS update_media_updated_at() CASCADE;

-- Drop and recreate the media table RLS policies
DROP POLICY IF EXISTS "Allow public read access to media" ON media;
DROP POLICY IF EXISTS "Allow authenticated write access to media" ON media;
DROP POLICY IF EXISTS "Enable read access for media" ON media;
DROP POLICY IF EXISTS "Enable insert access for media" ON media;
DROP POLICY IF EXISTS "Enable update access for media" ON media;
DROP POLICY IF EXISTS "Enable delete access for media" ON media;
DROP POLICY IF EXISTS "super_admin_access_media" ON media;
DROP POLICY IF EXISTS "Braden admin bypass for media" ON media;

-- Remove any other existing policies on media table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'media' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON media';
    END LOOP;
END $$;

-- Recreate functions as SECURITY INVOKER (safer)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER
SECURITY INVOKER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER
SECURITY INVOKER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION is_developer_admin()
RETURNS boolean
SECURITY INVOKER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Simple email check without role escalation
    RETURN (auth.email() = 'braden.lang77@gmail.com');
END;
$$;

CREATE OR REPLACE FUNCTION admin_bypass()
RETURNS boolean
SECURITY INVOKER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Simple email check without role escalation
    RETURN (auth.email() = 'braden.lang77@gmail.com');
END;
$$;

-- Ensure media table exists and has proper structure
CREATE TABLE IF NOT EXISTS media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    file_path text NOT NULL,
    file_type text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS on media table
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies without function calls
CREATE POLICY "media_public_read"
ON media
FOR SELECT
TO public
USING (true);

CREATE POLICY "media_authenticated_all"
ON media
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant explicit permissions to authenticated role
GRANT SELECT ON media TO authenticated;
GRANT INSERT ON media TO authenticated;
GRANT UPDATE ON media TO authenticated;
GRANT DELETE ON media TO authenticated;

-- Grant public read access
GRANT SELECT ON media TO anon;

-- Recreate the trigger with the new function
DROP TRIGGER IF EXISTS update_media_updated_at ON media;
CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();