-- Migration to fix row-level security and storage policies for hero images and admin users

-- 1. Clean up existing policies related to the hero-images bucket to avoid duplicates
DROP POLICY IF EXISTS "Developer admin full storage access" ON storage.objects;
DROP POLICY IF EXISTS "Developer admin full access" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can do all storage operations" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for all buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated storage upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to insert into hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete hero-images" ON storage.objects;

-- 2. Recreate policies specific to the hero-images bucket

-- Allow the developer admin full access to hero-images
CREATE POLICY "Developer admin full access to hero-images"
ON storage.objects
FOR ALL TO authenticated
USING (
  bucket_id = 'hero-images' AND
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND email = 'braden.lang77@gmail.com'
  )
);

-- Allow anyone (including anonymous users) to read files from hero-images
CREATE POLICY "Public read access to hero-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hero-images');

-- Allow any authenticated user to upload files to hero-images
CREATE POLICY "Authenticated upload access to hero-images"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'hero-images');

-- Allow any authenticated user to update files in hero-images
CREATE POLICY "Authenticated update access to hero-images"
ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'hero-images')
WITH CHECK (bucket_id = 'hero-images');

-- Allow any authenticated user to delete files from hero-images
CREATE POLICY "Authenticated delete access to hero-images"
ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'hero-images');

-- 3. Ensure row level security is enabled on storage tables
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- 4. Clean up and recreate admin_users policy to ensure the developer can manage admin users
DROP POLICY IF EXISTS "Developer admin access to admin_users" ON admin_users;
CREATE POLICY "Developer admin access to admin_users"
ON admin_users
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND email = 'braden.lang77@gmail.com'
  )
);
