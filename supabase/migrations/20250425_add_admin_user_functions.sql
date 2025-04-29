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

-- Function to check if user has a specific permission on a resource
CREATE OR REPLACE FUNCTION public.check_permission(
  user_id UUID,
  resource_type TEXT,
  resource_id UUID,
  action TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  has_permission BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM permissions
    WHERE role_id IN (
      SELECT role_id
      FROM user_roles
      WHERE user_id = user_id
    )
    AND resource_type = resource_type
    AND resource_id = resource_id
    AND action = action
  ) INTO has_permission;

  RETURN has_permission;
END;
$$;

-- Function to get all roles for a user across organizations
CREATE OR REPLACE FUNCTION public.get_user_roles(
  user_id UUID
) RETURNS TABLE(role TEXT, organization_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT role, organization_id
  FROM user_roles
  WHERE user_id = user_id;
END;
$$;

-- Function to check if user is member of organization
CREATE OR REPLACE FUNCTION public.is_org_member(
  user_id UUID,
  organization_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  is_member BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM user_organizations
    WHERE user_id = user_id
    AND organization_id = organization_id
  ) INTO is_member;

  RETURN is_member;
END;
$$;
