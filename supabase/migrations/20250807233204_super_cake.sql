/*
  # Fix Policy Conflicts Migration

  This migration drops existing RLS policies before recreating them to prevent
  "policy already exists" errors (42710). This makes the migration idempotent.

  ## Changes Made:
  1. Drop all existing policies before recreating them
  2. Ensure tables have RLS enabled
  3. Recreate all necessary policies with proper permissions
  4. Handle both existing and new policy definitions
*/

-- Drop existing policies to prevent conflicts
-- Site Settings policies
DROP POLICY IF EXISTS "Enable read for all users" ON site_settings;
DROP POLICY IF EXISTS "Enable write for admin users only" ON site_settings;
DROP POLICY IF EXISTS "Enable update for admin users only" ON site_settings;
DROP POLICY IF EXISTS "Enable delete for admin users only" ON site_settings;
DROP POLICY IF EXISTS "Allow full access to site_settings" ON site_settings;

-- Page Layouts policies
DROP POLICY IF EXISTS "Enable read for all users" ON page_layouts;
DROP POLICY IF EXISTS "Enable write for admin users only" ON page_layouts;
DROP POLICY IF EXISTS "Enable update for admin users only" ON page_layouts;
DROP POLICY IF EXISTS "Enable delete for admin users only" ON page_layouts;
DROP POLICY IF EXISTS "super_admin_access_page_layouts" ON page_layouts;

-- Custom Components policies
DROP POLICY IF EXISTS "Enable read for all users" ON custom_components;
DROP POLICY IF EXISTS "Enable write for admin users only" ON custom_components;
DROP POLICY IF EXISTS "Enable update for admin users only" ON custom_components;
DROP POLICY IF EXISTS "Enable delete for admin users only" ON custom_components;

-- Content Pages policies
DROP POLICY IF EXISTS "Enable read for all users to published content" ON content_pages;
DROP POLICY IF EXISTS "Enable write access for authenticated users - insert" ON content_pages;
DROP POLICY IF EXISTS "Enable write access for authenticated users - update/delete" ON content_pages;
DROP POLICY IF EXISTS "Enable write access for authenticated users - delete" ON content_pages;
DROP POLICY IF EXISTS "Public can view published content" ON content_pages;
DROP POLICY IF EXISTS "Public users can view published content" ON content_pages;
DROP POLICY IF EXISTS "Admins can view all content" ON content_pages;
DROP POLICY IF EXISTS "Admins can insert content" ON content_pages;
DROP POLICY IF EXISTS "Admins can update content" ON content_pages;
DROP POLICY IF EXISTS "Admins can delete content" ON content_pages;
DROP POLICY IF EXISTS "Admin users can manage all content" ON content_pages;
DROP POLICY IF EXISTS "Allow developer to access content_pages" ON content_pages;
DROP POLICY IF EXISTS "Braden admin bypass for content_pages" ON content_pages;

-- Content Blocks policies
DROP POLICY IF EXISTS "Enable read for all users" ON content_blocks;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON content_blocks;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON content_blocks;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON content_blocks;
DROP POLICY IF EXISTS "Users can view content blocks" ON content_blocks;
DROP POLICY IF EXISTS "Allow developer to access content blocks" ON content_blocks;
DROP POLICY IF EXISTS "Allow developer to access content_blocks" ON content_blocks;
DROP POLICY IF EXISTS "Braden admin bypass for content_blocks" ON content_blocks;

-- Admin Users policies
DROP POLICY IF EXISTS "Admin select policy" ON admin_users;
DROP POLICY IF EXISTS "Admin insert policy" ON admin_users;
DROP POLICY IF EXISTS "Admin update policy" ON admin_users;
DROP POLICY IF EXISTS "Admin delete policy" ON admin_users;
DROP POLICY IF EXISTS "Developer admin access to admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow developer to access admin_users" ON admin_users;
DROP POLICY IF EXISTS "Braden admin bypass for admin_users" ON admin_users;
DROP POLICY IF EXISTS "Developer admin access to admin_users" ON admin_users;
DROP POLICY IF EXISTS "Developer can access all admin_users" ON admin_users;
DROP POLICY IF EXISTS "Users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "super_admin_access" ON admin_users;
DROP POLICY IF EXISTS "super_admin_access_admin_users" ON admin_users;

-- Media policies
DROP POLICY IF EXISTS "Admin users can manage media" ON media;
DROP POLICY IF EXISTS "Allow full access to media" ON media;
DROP POLICY IF EXISTS "Braden admin bypass for media" ON media;
DROP POLICY IF EXISTS "Public media access" ON media;
DROP POLICY IF EXISTS "Users can view media" ON media;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  layout_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS custom_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  component_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_components ENABLE ROW LEVEL SECURITY;

-- Only enable RLS on content_pages if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'content_pages') THEN
    ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Only enable RLS on content_blocks if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'content_blocks') THEN
    ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Only enable RLS on admin_users if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_users') THEN
    ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Only enable RLS on media if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'media') THEN
    ALTER TABLE media ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for site_settings
CREATE POLICY "Enable read for all users" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Enable write for admin users only" ON site_settings FOR INSERT WITH CHECK (
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);
CREATE POLICY "Enable update for admin users only" ON site_settings FOR UPDATE USING (
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);
CREATE POLICY "Enable delete for admin users only" ON site_settings FOR DELETE USING (
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);

-- Create policies for page_layouts
CREATE POLICY "Enable read for all users" ON page_layouts FOR SELECT USING (
  is_published = true OR 
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);
CREATE POLICY "Enable write for admin users only" ON page_layouts FOR INSERT WITH CHECK (
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);
CREATE POLICY "Enable update for admin users only" ON page_layouts FOR UPDATE USING (
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);
CREATE POLICY "Enable delete for admin users only" ON page_layouts FOR DELETE USING (
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);

-- Create policies for custom_components
CREATE POLICY "Enable read for all users" ON custom_components FOR SELECT USING (true);
CREATE POLICY "Enable write for admin users only" ON custom_components FOR INSERT WITH CHECK (
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);
CREATE POLICY "Enable update for admin users only" ON custom_components FOR UPDATE USING (
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);
CREATE POLICY "Enable delete for admin users only" ON custom_components FOR DELETE USING (
  auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid OR
  (auth.email() = 'braden.lang77@gmail.com')
);

-- Create policies for content_pages (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'content_pages') THEN
    EXECUTE 'CREATE POLICY "Enable read for all users to published content" ON content_pages FOR SELECT USING (
      is_published = true OR 
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    )';
    
    EXECUTE 'CREATE POLICY "Enable write access for authenticated users - insert" ON content_pages FOR INSERT WITH CHECK (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    )';
    
    EXECUTE 'CREATE POLICY "Enable write access for authenticated users - update" ON content_pages FOR UPDATE USING (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    )';
    
    EXECUTE 'CREATE POLICY "Enable write access for authenticated users - delete" ON content_pages FOR DELETE USING (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    )';
  END IF;
END $$;

-- Create policies for content_blocks (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'content_blocks') THEN
    EXECUTE 'CREATE POLICY "Enable read for all users" ON content_blocks FOR SELECT USING (true)';
    
    EXECUTE 'CREATE POLICY "Enable insert for authenticated users" ON content_blocks FOR INSERT WITH CHECK (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    )';
    
    EXECUTE 'CREATE POLICY "Enable update for authenticated users" ON content_blocks FOR UPDATE USING (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    )';
    
    EXECUTE 'CREATE POLICY "Enable delete for authenticated users" ON content_blocks FOR DELETE USING (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    )';
  END IF;
END $$;

-- Create policies for admin_users (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_users') THEN
    EXECUTE 'CREATE POLICY "Developer admin access to admin_users" ON admin_users FOR ALL TO authenticated USING (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    ) WITH CHECK (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    )';
    
    EXECUTE 'CREATE POLICY "Admins can view admin_users" ON admin_users FOR SELECT TO authenticated USING (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'') OR
      EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    )';
  END IF;
END $$;

-- Create policies for media (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'media') THEN
    EXECUTE 'CREATE POLICY "Users can view media" ON media FOR SELECT USING (true)';
    
    EXECUTE 'CREATE POLICY "Admin users can manage media" ON media FOR ALL TO authenticated USING (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    ) WITH CHECK (
      auth.uid() = ''9600a18c-c8e3-44ef-83ad-99ede9268e77''::uuid OR
      (auth.email() = ''braden.lang77@gmail.com'')
    )';
  END IF;
END $$;

-- Create helper functions if they don't exist
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is the developer admin
  IF user_id = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid THEN
    RETURN true;
  END IF;
  
  -- Check if user email is the developer email
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id AND email = 'braden.lang77@gmail.com'
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if user is in admin_users table (if it exists)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_users') THEN
    IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = is_admin.user_id) THEN
      RETURN true;
    END IF;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_developer_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is the developer admin
  IF auth.uid() = '9600a18c-c8e3-44ef-83ad-99ede9268e77'::uuid THEN
    RETURN true;
  END IF;
  
  -- Check by email
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() AND email = 'braden.lang77@gmail.com'
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;