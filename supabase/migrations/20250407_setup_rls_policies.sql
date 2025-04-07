CREATE OR REPLACE FUNCTION public.create_settings_table()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'site_settings'
  ) THEN
    -- Create the site_settings table
    CREATE TABLE public.site_settings (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      site_name text NOT NULL,
      site_description text,
      contact_email text,
      contact_phone text,
      address text,
      logo_url text,
      primary_color text,
      secondary_color text,
      social_facebook text,
      social_twitter text,
      social_instagram text,
      social_linkedin text,
      updated_at timestamp with time zone DEFAULT now()
    );

    -- Set up RLS policies
    ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
    
    -- Allow authenticated users to select site_settings
    CREATE POLICY "Allow authenticated users to select site_settings"
      ON public.site_settings
      FOR SELECT
      TO authenticated
      USING (true);
    
    -- Allow authenticated users to insert site_settings
    CREATE POLICY "Allow authenticated users to insert site_settings"
      ON public.site_settings
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
    
    -- Allow authenticated users to update site_settings
    CREATE POLICY "Allow authenticated users to update site_settings"
      ON public.site_settings
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.setup_storage_policies(bucket_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Create policies for the specified bucket
  
  -- Allow authenticated users to select from storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow authenticated users to select from %I"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = %L);
  ', bucket_name, bucket_name);
  
  -- Allow authenticated users to insert into storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert into %I"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name);
  
  -- Allow authenticated users to update storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow authenticated users to update %I"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = %L)
    WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name, bucket_name);
  
  -- Allow authenticated users to delete from storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete from %I"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = %L);
  ', bucket_name, bucket_name);
  
  -- Create content table if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'content'
  ) THEN
    -- Create the content table
    CREATE TABLE public.content (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      title text NOT NULL,
      content text,
      image_url text,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    -- Set up RLS policies for content table
    ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
    
    -- Allow authenticated users to select content
    CREATE POLICY "Allow authenticated users to select content"
      ON public.content
      FOR SELECT
      TO authenticated
      USING (true);
    
    -- Allow authenticated users to insert content
    CREATE POLICY "Allow authenticated users to insert content"
      ON public.content
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
    
    -- Allow authenticated users to update content
    CREATE POLICY "Allow authenticated users to update content"
      ON public.content
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
    
    -- Allow authenticated users to delete content
    CREATE POLICY "Allow authenticated users to delete content"
      ON public.content
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$function$;
