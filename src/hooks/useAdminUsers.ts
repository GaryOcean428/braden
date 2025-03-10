
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
      
      // Check if user is developer by email
      const userEmail = sessionData.session.user.email;
      
      if (userEmail !== 'braden.lang77@gmail.com') {
        toast.error("Access Denied", {
          description: "You do not have administrator privileges"
        });
        setIsLoading(false);
        return;
      }
      
      setIsAdmin(true);
      loadAdminUsers();
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

  return {
    adminUsers,
    isLoading,
    error,
    isAdmin,
    checkAdminAndLoadUsers
  };
}
