
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminRole } from '@/types/permissions';

// Define the AdminUser type instead of importing it
export interface AdminUser {
  id?: string;
  user_id?: string;
  email?: string;
  created_at?: string;
  role?: AdminRole;
}

export const useAdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminAndLoadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Check developer status directly by email
      if (session.user.email === "braden.lang77@gmail.com") {
        console.log("Developer admin detected by direct email check");
        setIsAdmin(true);
      } else {
        // Fallback to RPC function for backward compatibility
        try {
          const { data: isDeveloperAdmin, error: adminCheckError } = await supabase.rpc('is_developer_admin');
          
          if (adminCheckError) {
            throw adminCheckError;
          }
          
          setIsAdmin(isDeveloperAdmin === true);
        } catch (err) {
          console.error("Error checking admin status:", err);
          // Continue with a false admin status
        }
      }

      // If not an admin, don't load users
      if (!isAdmin && session.user.email !== "braden.lang77@gmail.com") {
        setAdminUsers([]);
        return;
      }

      // Fetch admin users
      const { data: adminUsersData, error: fetchError } = await supabase
        .from('admin_users')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to ensure correct typing
      const formattedAdminUsers = adminUsersData.map(user => ({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        created_at: user.created_at,
        role: user.role as AdminRole
      }));

      setAdminUsers(formattedAdminUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Admin Access Error', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const addAdminUser = useCallback(async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log(`Adding admin user: ${email}`);
      
      // Call the edge function to add the admin user
      const { data, error } = await supabase.functions.invoke('add-admin-user', {
        body: { email }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error('Add Admin Failed', {
          description: error.message
        });
        return false;
      }

      if (data.error) {
        console.error('Admin user creation error:', data.error);
        toast.error('Add Admin Failed', {
          description: data.error
        });
        return false;
      }

      // Success scenario
      if (data.message === "User is already an admin") {
        toast.info('User Already Admin', {
          description: 'This email is already registered as an admin user'
        });
      } else {
        toast.success('Admin Added', {
          description: `${email} has been granted admin access`
        });
      }

      // Refresh the admin users list
      await checkAdminAndLoadUsers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add admin';
      console.error('Add admin exception:', errorMessage);
      toast.error('Add Admin Failed', {
        description: errorMessage
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkAdminAndLoadUsers]);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, [checkAdminAndLoadUsers]);

  return {
    adminUsers,
    isLoading,
    error,
    isAdmin,
    checkAdminAndLoadUsers,
    addAdminUser
  };
};
