
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'

type RequestBody = {
  bucket: string;
}

serve(async (req) => {
  // Create a Supabase client with the admin key
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({
        error: 'Missing environment variables',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Get the bucket name from the request
    const { bucket } = await req.json() as RequestBody
    
    if (!bucket) {
      return new Response(
        JSON.stringify({ error: 'Bucket name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`Ensuring bucket ${bucket} exists and has proper policies`)
    
    // First, check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
      return new Response(
        JSON.stringify({ error: 'Failed to list buckets', details: bucketsError }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Create bucket if it doesn't exist
    const bucketExists = buckets.some(b => b.name === bucket)
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucket}`)
      const { data, error } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })
      
      if (error) {
        console.error('Error creating bucket:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to create bucket', details: error }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      console.log(`Created bucket: ${bucket}`)
    } else {
      console.log(`Bucket ${bucket} already exists`)
    }
    
    // Update bucket to be public if needed
    const { error: updateError } = await supabase.storage.updateBucket(bucket, {
      public: true,
    })
    
    if (updateError) {
      console.error('Error updating bucket visibility:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update bucket visibility', details: updateError }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Create SQL for policy setup
    const sqlQuery = `
    -- Create policy for public read access
    CREATE POLICY IF NOT EXISTS "Public Read Access for ${bucket}" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = '${bucket}');
    
    -- Create policy for authenticated users insert
    CREATE POLICY IF NOT EXISTS "Auth Insert Access for ${bucket}" 
    ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = '${bucket}');
    
    -- Create policy for authenticated users update
    CREATE POLICY IF NOT EXISTS "Auth Update Access for ${bucket}" 
    ON storage.objects 
    FOR UPDATE TO authenticated 
    USING (bucket_id = '${bucket}') 
    WITH CHECK (bucket_id = '${bucket}');
    
    -- Create policy for authenticated users delete 
    CREATE POLICY IF NOT EXISTS "Auth Delete Access for ${bucket}" 
    ON storage.objects 
    FOR DELETE TO authenticated 
    USING (bucket_id = '${bucket}');
    `
    
    const { error: sqlError } = await supabase.rpc('exec_sql', { query: sqlQuery })
    
    if (sqlError) {
      console.error('Error creating policies:', sqlError)
      return new Response(
        JSON.stringify({ error: 'Failed to create policies', details: sqlError }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully ensured "${bucket}" bucket exists with appropriate policies` 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Unexpected error occurred', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
