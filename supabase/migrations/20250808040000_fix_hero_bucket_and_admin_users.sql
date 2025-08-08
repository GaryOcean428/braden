-- Migration to fix row-level security for hero-images bucket and admin_users table

-- 1. Policies for storage.buckets

-- Allow the developer admin full access to the hero-images bucket (read, write, update, delete)
CREATE POLICY "Developer admin full access to hero-images bucket"
ON storage.buckets
FOR ALL TO authenticated
USING (
  id = 'hero-images' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND email = 'braden.lang77@gmail.com'
  )
);

-- Allow public (including anonymous users) to select bucket metadata for hero-images
CREATE POLICY "Public read access to hero-images bucket"
ON storage.buckets
FOR SELECT
USING (id = 'hero-images');

-- 2. Additional policies for admin_users

-- Remove any existing developer admin policy on admin_users to avoid duplication
DROP POLICY IF EXISTS "Developer admin access to admin_users" ON admin_users;

-- Allow developer admin to perform any operation on admin_users
CREATE POLICY "Developer admin full access to admin_users"
ON admin_users
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND email = 'braden.lang77@gmail.com'
  )
);

-- Allow select on admin_users for the service_role (used by Supabase serverless client) so that admin user list can be fetched
CREATE POLICY "Service role read access to admin_users"
ON admin_users
FOR SELECT TO service_role
USING (true);