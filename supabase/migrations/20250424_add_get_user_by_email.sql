
-- Function to get a user by their email
CREATE OR REPLACE FUNCTION public.get_user_by_email(email_input TEXT)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_record json;
BEGIN
  SELECT json_build_object(
    'id', id,
    'email', email,
    'created_at', created_at
  )
  INTO user_record
  FROM auth.users
  WHERE email = email_input;
  
  RETURN user_record;
END;
$$;
