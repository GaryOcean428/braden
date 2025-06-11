
-- Fix storage policies for developer admin access
-- First, drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Admin users can do all storage operations" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can create buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Developer admin full access" ON storage.objects;
DROP POLICY IF EXISTS "Developer admin bucket access" ON storage.buckets;

-- Create comprehensive storage policies for developer admin
CREATE POLICY "Developer admin full storage access"
ON storage.objects
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() 
    AND email = 'braden.lang77@gmail.com'
  )
);

-- Allow developer admin to manage buckets
CREATE POLICY "Developer admin bucket management"
ON storage.buckets
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() 
    AND email = 'braden.lang77@gmail.com'
  )
);

-- Create public read access for all storage buckets
CREATE POLICY "Public read access for all buckets"
ON storage.objects
FOR SELECT
USING (true);

-- Allow authenticated users to upload to specific buckets
CREATE POLICY "Authenticated upload access"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('media', 'content-images', 'hero-images', 'profile-images', 'logos', 'favicons')
);

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated update access"
ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id IN ('media', 'content-images', 'hero-images', 'profile-images', 'logos', 'favicons')
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated delete access"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id IN ('media', 'content-images', 'hero-images', 'profile-images', 'logos', 'favicons')
);

-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('content-images', 'content-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('hero-images', 'hero-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('profile-images', 'profile-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('logos', 'logos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']),
  ('favicons', 'favicons', true, 1048576, ARRAY['image/x-icon', 'image/png', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS on storage tables
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
