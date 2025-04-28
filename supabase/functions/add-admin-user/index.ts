
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
    // Create a Supabase client with the service role key (required for auth.users access)
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

    // Find user by email in auth.users
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(email);

    if (userError || !userData?.user) {
      console.error("User lookup error:", userError || "No user found");
      return new Response(
        JSON.stringify({ error: "User not found. They must register first." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    console.log(`User found with ID: ${userData.user.id}`);

    // Check if user already exists in admin_users table
    const { data: existingAdmin, error: checkError } = await supabaseClient
      .from("admin_users")
      .select("id")
      .eq("user_id", userData.user.id)
      .single();

    if (existingAdmin) {
      console.log("User is already an admin");
      return new Response(
        JSON.stringify({ message: "User is already an admin", user: existingAdmin }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Insert user into admin_users table
    const { data: adminData, error: adminError } = await supabaseClient
      .from("admin_users")
      .insert({
        user_id: userData.user.id,
        email: email,
        role: "viewer" // Default role
      })
      .select()
      .single();

    if (adminError) {
      console.error("Admin creation error:", adminError);
      return new Response(
        JSON.stringify({ error: adminError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("Admin user created successfully");
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
