-- Create admin_users table to fix 403 errors
-- This table stores users who have admin privileges

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users table
-- Allow authenticated users to read admin_users (needed for admin checks)
CREATE POLICY "Allow authenticated users to read admin_users"
ON public.admin_users
FOR SELECT TO authenticated
USING (true);

-- Only allow admin users to insert/update/delete admin_users records
-- (This ensures only existing admins can create new admins)
CREATE POLICY "Allow admin users to manage admin_users"
ON public.admin_users
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Insert the developer admin user
-- This ensures braden.lang77@gmail.com is always an admin
DO $$
DECLARE
  developer_user_id uuid;
BEGIN
  -- Find the developer user by email
  SELECT id INTO developer_user_id
  FROM auth.users
  WHERE email = 'braden.lang77@gmail.com';
  
  -- If the user exists, make them an admin
  IF developer_user_id IS NOT NULL THEN
    INSERT INTO public.admin_users (user_id, email)
    VALUES (developer_user_id, 'braden.lang77@gmail.com')
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Developer admin user added/confirmed: braden.lang77@gmail.com';
  ELSE
    RAISE NOTICE 'Developer user not found in auth.users table yet';
  END IF;
END $$;