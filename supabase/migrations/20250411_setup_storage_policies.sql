
-- Create a function to set up storage policies for a bucket
CREATE OR REPLACE FUNCTION public.setup_storage_policies(bucket_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Create policies for the specified bucket
  
  -- Allow anonymous users to select from storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow public access to %I"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = %L);
  ', bucket_name, bucket_name);
  
  -- Allow anonymous users to insert into storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow public to insert into %I"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name);
  
  -- Allow authenticated users to update storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow public to update %I"
    ON storage.objects
    FOR UPDATE
    USING (bucket_id = %L)
    WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name, bucket_name);
  
  -- Allow authenticated users to delete from storage
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow public to delete from %I"
    ON storage.objects
    FOR DELETE
    USING (bucket_id = %L);
  ', bucket_name, bucket_name);
END;
$function$;
