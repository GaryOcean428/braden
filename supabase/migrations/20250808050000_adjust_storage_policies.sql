-- Migration to adjust storage policies for hero-images bucket

-- Drop existing policies that may conflict with the new definitions
DROP POLICY IF EXISTS "Developer admin full access to hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Developer admin full access to hero-images bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Service role read access to hero-images objects" ON storage.objects;

-- 1. Define comprehensive access policy for the developer admin on storage.objects
--    Include WITH CHECK to ensure data-modifying commands succeed when the condition holds.
CREATE POLICY "Developer admin full access to hero-images"
ON storage.objects
FOR ALL TO authenticated
USING (
    bucket_id = 'hero-images'
    AND EXISTS (
        SELECT 1
        FROM auth.users
        WHERE id = auth.uid()
          AND email = 'braden.lang77@gmail.com'
    )
)
WITH CHECK (
    bucket_id = 'hero-images'
    AND EXISTS (
        SELECT 1
        FROM auth.users
        WHERE id = auth.uid()
          AND email = 'braden.lang77@gmail.com'
    )
);

-- 2. Grant the service role full access to hero-images objects to facilitate server-side operations
CREATE POLICY "Service role full access to hero-images"
ON storage.objects
FOR ALL TO service_role
USING (bucket_id = 'hero-images')
WITH CHECK (bucket_id = 'hero-images');

-- 3. Define corresponding policies for the buckets table
DROP POLICY IF EXISTS "Developer admin full access to hero-images bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Public read access to hero-images bucket" ON storage.buckets;

-- Developer admin can read/write/update/delete the hero-images bucket metadata
CREATE POLICY "Developer admin full access to hero-images bucket"
ON storage.buckets
FOR ALL TO authenticated
USING (
    id = 'hero-images'
    AND EXISTS (
        SELECT 1
        FROM auth.users
        WHERE id = auth.uid()
          AND email = 'braden.lang77@gmail.com'
    )
)
WITH CHECK (
    id = 'hero-images'
    AND EXISTS (
        SELECT 1
        FROM auth.users
        WHERE id = auth.uid()
          AND email = 'braden.lang77@gmail.com'
    )
);

-- Public (anonymous) read access to hero-images bucket metadata
CREATE POLICY "Public read access to hero-images bucket"
ON storage.buckets
FOR SELECT
USING (id = 'hero-images');
