
-- This migration fixes the storage policies to properly allow access to buckets

-- Drop the existing function if it exists (we'll replace it with a better version)
DROP FUNCTION IF EXISTS public.setup_storage_policies(text);

-- Create an improved function to set up storage policies that works correctly
CREATE OR REPLACE FUNCTION public.setup_storage_policies(bucket_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Create policies for the specified bucket
  
  -- First ensure the bucket exists (create if not exists)
  BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES (bucket_name, bucket_name, true)
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Bucket creation failed: %', SQLERRM;
  END;
  
  -- Allow public access to select from storage (read access)
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow public access to %I"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = %L);
  ', bucket_name, bucket_name);
  
  -- Allow authenticated users to insert into storage (upload)
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow authenticated to insert into %I"
    ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name);
  
  -- Allow authenticated users to update storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow authenticated to update %I"
    ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = %L)
    WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name, bucket_name);
  
  -- Allow authenticated users to delete from storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow authenticated to delete from %I"
    ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = %L);
  ', bucket_name, bucket_name);

  -- Enable RLS on storage.objects if not already enabled
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  
  RAISE NOTICE 'Successfully created policies for bucket: %', bucket_name;
END;
$function$;

-- Create policies for system administrators to manage all storage
-- This ensures admins can always access and manage storage regardless of other policies
CREATE POLICY IF NOT EXISTS "Admin users can do all storage operations"
ON storage.objects
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() 
    AND (
      email = 'braden.lang77@gmail.com' OR
      (raw_user_meta_data->>'role')::text = 'admin'
    )
  )
);

-- Create policy allowing admin users to create buckets
CREATE POLICY IF NOT EXISTS "Admin users can create buckets"
ON storage.buckets
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() 
    AND (
      email = 'braden.lang77@gmail.com' OR
      (raw_user_meta_data->>'role')::text = 'admin'
    )
  )
);

-- Execute the function for each required bucket
SELECT setup_storage_policies('hero-images');
SELECT setup_storage_policies('content-images');
SELECT setup_storage_policies('profile-images');
SELECT setup_storage_policies('media');
