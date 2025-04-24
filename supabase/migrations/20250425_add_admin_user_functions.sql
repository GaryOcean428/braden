
-- Function to safely add an admin user by email
CREATE OR REPLACE FUNCTION public.add_admin_user_by_email(email_input TEXT)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = email_input;
  
  -- If user exists, add them as admin
  IF user_id IS NOT NULL THEN
    INSERT INTO public.admin_users (user_id, email)
    VALUES (user_id, email_input)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN user_id;
  END IF;
  
  -- If not found
  RETURN NULL;
END;
$$;

-- Function to check if current user is a developer admin
CREATE OR REPLACE FUNCTION public.is_developer_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if the current user is an admin
  RETURN EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE user_id = auth.uid()
  );
END;
$$;
