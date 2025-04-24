
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AdminUser = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  email?: string;
  created_at_user?: string;
};

export function useAdminUsers() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status and load users
  const checkAdminAndLoadUsers = async () => {
    try {
      // Check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error("Session check error:", sessionError);
        toast.error("Authentication Error", {
          description: "You must be logged in to access this page"
        });
        setIsLoading(false);
        return;
      }
      
      // Check if user is developer by email or function
      const { data: isDeveloper, error: devError } = await supabase.rpc('is_developer');
      
      if (devError) {
        console.error("Developer check error:", devError);
        setIsLoading(false);
        return;
      }
      
      if (isDeveloper) {
        setIsAdmin(true);
        loadAdminUsers();
      } else {
        toast.error("Access Denied", {
          description: "Only the developer can access admin functions"
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Authentication Error", {
        description: "Failed to verify authentication"
      });
      setIsLoading(false);
    }
  };

  // Load admin users
  const loadAdminUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch directly from the admin_users table
      const { data: adminData, error: fetchError } = await supabase
        .from('admin_users')
        .select('*');
      
      if (!fetchError && adminData) {
        // Attempt to enrich with user data
        try {
          const { data: userData, error: profilesError } = await supabase
            .from('user_profiles')
            .select('*');
          
          if (!profilesError && userData) {
            const enrichedAdmins = adminData.map(admin => {
              const matchingUser = userData.find(user => user.id === admin.user_id);
              return {
                ...admin,
                email: matchingUser?.email || 'Unknown',
                created_at_user: matchingUser?.created_at || null
              };
            });
            
            setAdminUsers(enrichedAdmins);
          } else {
            setAdminUsers(adminData);
          }
        } catch (error) {
          console.error("Error fetching user profiles:", error);
          setAdminUsers(adminData);
        }
      } else {
        console.warn("Could not fetch admin users:", fetchError);
        setError("The admin users list cannot be displayed due to permission restrictions, but your admin access is confirmed.");
        setAdminUsers([]);
      }
    } catch (error: any) {
      console.error('Error loading admin users:', error);
      setError(error.message || "Failed to load admin users");
      toast.error("Error", {
        description: "Failed to load admin users"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new admin user
  const addAdminUser = async (email: string) => {
    try {
      setIsLoading(true);
      
      // First, check if the user exists in auth.users
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_by_email', { email_input: email });
      
      if (userError || !userData) {
        toast.error("User Not Found", {
          description: "No user found with that email address"
        });
        return false;
      }
      
      // Check if user is already an admin
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      
      if (existingAdmin) {
        toast.info("Already Admin", {
          description: "This user is already an admin"
        });
        return false;
      }
      
      // Add the user to admin_users table
      const { data, error: insertError } = await supabase
        .from('admin_users')
        .insert([
          { user_id: userData.id, email: email }
        ])
        .select();
      
      if (insertError) {
        console.error("Error adding admin user:", insertError);
        toast.error("Error", {
          description: "Failed to add admin user"
        });
        return false;
      }
      
      toast.success("Admin Added", {
        description: `${email} has been added as an admin`
      });
      
      // Also add admin role to user_roles
      await supabase
        .from('user_roles')
        .insert([
          { user_id: userData.id, role: 'admin' }
        ]);
      
      // Refresh the admin users list
      loadAdminUsers();
      return true;
    } catch (error: any) {
      console.error("Error in addAdminUser:", error);
      toast.error("Error", {
        description: error.message || "Failed to add admin user"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Configure permission settings
  const configurePermissions = async () => {
    try {
      setIsLoading(true);
      
      // Create a function to bypass RLS for admin operations
      const { data, error } = await supabase.rpc('fix_user_access');
      
      if (error) {
        console.error("Error configuring permissions:", error);
        toast.error("Permission Error", {
          description: "Failed to configure database permissions"
        });
        return false;
      }
      
      toast.success("Permissions Updated", {
        description: "Database permissions have been configured"
      });
      
      // Reload admin users to verify changes
      loadAdminUsers();
      return true;
    } catch (error: any) {
      console.error("Error configuring permissions:", error);
      toast.error("Error", {
        description: error.message || "Failed to configure permissions"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    adminUsers,
    isLoading,
    error,
    isAdmin,
    checkAdminAndLoadUsers,
    addAdminUser,
    configurePermissions
  };
}
