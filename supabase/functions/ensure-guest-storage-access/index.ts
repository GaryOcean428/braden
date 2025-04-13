
// This edge function allows creating and managing storage buckets without requiring authentication
// It uses the service role key to bypass RLS policies

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }
  
  try {
    // Get the request body
    const { bucket } = await req.json()
    
    if (!bucket) {
      return new Response(
        JSON.stringify({ error: "Bucket name is required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      )
    }
    
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    )
    
    // Check if the bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return new Response(
        JSON.stringify({ error: "Failed to list buckets", details: listError }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      )
    }
    
    // Create the bucket if it doesn't exist
    if (!buckets?.find(b => b.name === bucket)) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })
      
      if (createError) {
        console.error(`Error creating bucket ${bucket}:`, createError)
        return new Response(
          JSON.stringify({ error: `Failed to create bucket ${bucket}`, details: createError }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500 
          }
        )
      }
      
      console.log(`Created bucket: ${bucket}`)
    }
    
    // Run the setup_storage_policies function for this bucket
    const { error: policyError } = await supabaseAdmin.rpc('setup_storage_policies', {
      bucket_name: bucket
    })
    
    if (policyError) {
      console.error(`Error setting up policies for bucket ${bucket}:`, policyError)
      return new Response(
        JSON.stringify({ 
          error: `Created bucket ${bucket} but failed to set up policies`, 
          details: policyError 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully set up bucket ${bucket} with public access policies` 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    )
  }
})
