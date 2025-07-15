
-- Step 1: Clean up all conflicting RLS policies on admin_users table
DROP POLICY IF EXISTS "Enable read for all users" ON admin_users;
DROP POLICY IF EXISTS "Enable write for admin users only" ON admin_users;
DROP POLICY IF EXISTS "Enable update for admin users only" ON admin_users;
DROP POLICY IF EXISTS "Enable delete for admin users only" ON admin_users;
DROP POLICY IF EXISTS "Developer admin full access" ON admin_users;
DROP POLICY IF EXISTS "Allow admin access" ON admin_users;
DROP POLICY IF EXISTS "Allow admin users to read" ON admin_users;
DROP POLICY IF EXISTS "Allow admin users to write" ON admin_users;
DROP POLICY IF EXISTS "Allow admin users to update" ON admin_users;
DROP POLICY IF EXISTS "Allow admin users to delete" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON admin_users;
DROP POLICY IF EXISTS "Public read access" ON admin_users;

-- Step 2: Clean up all conflicting storage policies on storage.objects
DROP POLICY IF EXISTS "Developer admin full storage access" ON storage.objects;
DROP POLICY IF EXISTS "Developer admin full access" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can do all storage operations" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for all buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to insert into media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to insert into hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to content-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to insert into content-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update content-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete content-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to insert into profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to insert into logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to favicons" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to insert into favicons" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update favicons" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete favicons" ON storage.objects;

-- Step 3: Clean up all conflicting storage policies on storage.buckets
DROP POLICY IF EXISTS "Developer admin bucket management" ON storage.buckets;
DROP POLICY IF EXISTS "Developer admin bucket access" ON storage.buckets;
DROP POLICY IF EXISTS "Admin users can create buckets" ON storage.buckets;

-- Step 4: Create simple, non-conflicting policies for admin_users
CREATE POLICY "Developer admin access to admin_users"
ON admin_users
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() 
    AND email = 'braden.lang77@gmail.com'
  )
);

-- Step 5: Create simple, non-conflicting policies for storage.objects
CREATE POLICY "Developer admin storage access"
ON storage.objects
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() 
    AND email = 'braden.lang77@gmail.com'
  )
);

CREATE POLICY "Public read storage access"
ON storage.objects
FOR SELECT
USING (true);

CREATE POLICY "Authenticated storage upload"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (true);

-- Step 6: Create simple policy for storage.buckets
CREATE POLICY "Developer admin bucket access"
ON storage.buckets
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() 
    AND email = 'braden.lang77@gmail.com'
  )
);

-- Step 7: Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
