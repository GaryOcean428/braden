
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Searching for user with email: ${email}`);

    // Direct query to auth.users table using service role key
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(email);

    if (userError) {
      console.error("Error finding user:", userError);
      return new Response(
        JSON.stringify({ error: "Failed to find user" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Check if we got a valid user
    if (!userData || !userData.user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    const userId = userData.user.id;

    // Check if the user is already an admin
    const { data: existingAdmin, error: adminCheckError } = await supabaseClient
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminCheckError) {
      console.error("Error checking for existing admin:", adminCheckError);
    }

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "User is already an admin" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Insert user into admin_users table
    const { data: adminData, error: adminError } = await supabaseClient
      .from("admin_users")
      .insert({
        user_id: userId,
        email: email,
        role: 'admin'
      })
      .select()
      .single();

    if (adminError) {
      console.error("Error adding admin user:", adminError);
      return new Response(
        JSON.stringify({ error: adminError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify(adminData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
