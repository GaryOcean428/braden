-- Migration to fix RLS policies for admin_users and storage according to problem statement
-- This addresses:
-- 1. 403 on admin_users (RLS policy issues) 
-- 2. 400 / "new row violates row-level security policy" on Storage listing

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. Fix admin_users table policies
-- ═══════════════════════════════════════════════════════════════════════════════

-- Ensure RLS is enabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Developer admin full access to admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Developer admin access to admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Service role read access to admin_users" ON public.admin_users;

-- Allow developer admin to read/write admin_users
CREATE POLICY "admins can read and write"
ON public.admin_users
FOR ALL TO authenticated
USING (
    -- Developer admin can access all records
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND email = 'braden.lang77@gmail.com'
    )
    OR
    -- Admin users can read their own record
    auth.uid() = user_id::uuid
)
WITH CHECK (
    -- Developer admin can insert/update any record
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND email = 'braden.lang77@gmail.com'
    )
    OR
    -- Admin users can update their own record
    auth.uid() = user_id::uuid
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. Fix Storage policies for hero-images bucket
-- ═══════════════════════════════════════════════════════════════════════════════

-- Storage listing uses internal temp table inserts, so we need both SELECT and INSERT policies

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Developer admin full access to hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access to hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access to hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access to hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Service role full access to hero-images" ON storage.objects;

-- SELECT policy for listing hero-images (enables .list() operation)
CREATE POLICY "list hero-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hero-images');

-- INSERT policy for hero-images (enables .list() internal temp table operations)
CREATE POLICY "insert hero-images"
ON storage.objects  
FOR INSERT
WITH CHECK (bucket_id = 'hero-images');

-- UPDATE policy for hero-images (for authenticated users)
CREATE POLICY "update hero-images"
ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'hero-images')
WITH CHECK (bucket_id = 'hero-images');

-- DELETE policy for hero-images (for authenticated users)
CREATE POLICY "delete hero-images"
ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'hero-images');

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. Fix Storage bucket policies
-- ═══════════════════════════════════════════════════════════════════════════════

-- Ensure RLS is enabled on buckets table
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Drop existing bucket policies
DROP POLICY IF EXISTS "Developer admin full access to hero-images bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Public read access to hero-images bucket" ON storage.buckets;

-- Allow everyone to read bucket metadata (required for public access)
CREATE POLICY "public bucket access"
ON storage.buckets
FOR SELECT
USING (id = 'hero-images');

-- Allow authenticated users to manage bucket (if needed)
CREATE POLICY "authenticated bucket management"
ON storage.buckets  
FOR ALL TO authenticated
USING (id = 'hero-images')
WITH CHECK (id = 'hero-images');