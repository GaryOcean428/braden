/*
  # Fix Media Permission Errors

  This migration resolves the "permission denied to set role 'admin'" errors
  by removing problematic SQL functions and fixing RLS policies that attempt
  to use SET ROLE commands.

  ## Changes Made
  1. Drop and recreate problematic SQL functions without SET ROLE commands
  2. Fix media table RLS policies to use direct checks instead of role escalation
  3. Ensure proper permissions without privilege escalation
*/

-- Drop existing problematic functions that might use SET ROLE
DROP FUNCTION IF EXISTS is_developer_admin() CASCADE;
DROP FUNCTION IF EXISTS admin_bypass() CASCADE;
DROP FUNCTION IF EXISTS has_admin_access() CASCADE;
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;

-- Create safe admin check functions without SET ROLE commands
CREATE OR REPLACE FUNCTION is_developer_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Direct check without role escalation
  RETURN (
    auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid 
    OR 
    auth.email() = 'braden.lang77@gmail.com'
  );
END;
$$;

CREATE OR REPLACE FUNCTION admin_bypass()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Direct check without role escalation
  RETURN (
    auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid 
    OR 
    auth.email() = 'braden.lang77@gmail.com'
  );
END;
$$;

CREATE OR REPLACE FUNCTION has_admin_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check admin_users table directly without role escalation
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  ) OR (
    auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid 
    OR 
    auth.email() = 'braden.lang77@gmail.com'
  );
END;
$$;

-- Fix media table policies
DROP POLICY IF EXISTS "Admin users can manage media" ON media;
DROP POLICY IF EXISTS "Users can view media" ON media;

-- Create new media policies without problematic function calls
CREATE POLICY "Admin users can manage media" ON media
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid 
    OR 
    auth.email() = 'braden.lang77@gmail.com'
    OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid 
    OR 
    auth.email() = 'braden.lang77@gmail.com'
    OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Users can view media" ON media
  FOR SELECT
  TO public
  USING (true);

-- Ensure authenticated role has proper access to admin_users table for the policy checks
GRANT SELECT ON admin_users TO authenticated;

-- Also fix any other tables that might have similar issues
DO $$
BEGIN
  -- Fix admin_users policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_users' AND schemaname = 'public') THEN
    DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
    DROP POLICY IF EXISTS "Developer admin access to admin_users" ON admin_users;
    
    CREATE POLICY "Admins can view admin_users" ON admin_users
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid 
        OR 
        auth.email() = 'braden.lang77@gmail.com'
        OR
        EXISTS (
          SELECT 1 FROM admin_users au 
          WHERE au.user_id = auth.uid() 
          AND au.role IN ('admin', 'editor')
        )
      );
      
    CREATE POLICY "Developer admin access to admin_users" ON admin_users
      FOR ALL
      TO authenticated
      USING (
        auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid 
        OR 
        auth.email() = 'braden.lang77@gmail.com'
      )
      WITH CHECK (
        auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid 
        OR 
        auth.email() = 'braden.lang77@gmail.com'
      );
  END IF;
END $$;