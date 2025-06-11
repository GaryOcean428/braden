-- Clean up and consolidate storage policies to fix RLS issues
-- This migration removes conflicting policies and creates a clean set

-- Drop all existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Admin users can do all storage operations" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can create buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Developer admin full access" ON storage.objects;
DROP POLICY IF EXISTS "Developer admin bucket access" ON storage.buckets;
DROP POLICY IF EXISTS "Developer admin full storage access" ON storage.objects;
DROP POLICY IF EXISTS "Developer admin bucket management" ON storage.buckets;
DROP POLICY IF EXISTS "Public read access for all buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access" ON storage.objects;

-- Drop any bucket-specific policies that might exist
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing bucket-specific policies
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            policy_record.policyname, 
            policy_record.schemaname, 
            policy_record.tablename);
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create clean, non-conflicting storage policies

-- 1. Admin users (those in admin_users table) have full access to all storage
CREATE POLICY "Admin full storage access"
ON storage.objects
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- 2. Admin users can manage buckets
CREATE POLICY "Admin bucket management"
ON storage.buckets
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- 3. Public read access for all storage objects (needed for serving images)
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
USING (true);

-- 4. Authenticated users can upload to specific buckets
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('media', 'content-images', 'hero-images', 'profile-images', 'logos', 'favicons')
);

-- 5. Authenticated users can update their own uploads or admins can update any
CREATE POLICY "Users can update own files or admins can update any"
ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id IN ('media', 'content-images', 'hero-images', 'profile-images', 'logos', 'favicons')
  AND (
    -- User can update their own files (if owner_id is set)
    (owner_id IS NOT NULL AND owner_id = auth.uid())
    OR
    -- Admin can update any file
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
    OR
    -- If no owner_id is set, allow authenticated users (for legacy files)
    owner_id IS NULL
  )
);

-- 6. Authenticated users can delete their own uploads or admins can delete any
CREATE POLICY "Users can delete own files or admins can delete any"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id IN ('media', 'content-images', 'hero-images', 'profile-images', 'logos', 'favicons')
  AND (
    -- User can delete their own files (if owner_id is set)
    (owner_id IS NOT NULL AND owner_id = auth.uid())
    OR
    -- Admin can delete any file
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
    OR
    -- If no owner_id is set, allow authenticated users (for legacy files)
    owner_id IS NULL
  )
);