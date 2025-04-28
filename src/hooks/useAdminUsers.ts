
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

      // Check if the current user is an admin
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Check developer status using Supabase function
      const { data, error: adminCheckError } = await supabase.rpc('is_developer_admin');
      
      if (adminCheckError) {
        throw adminCheckError;
      }

      setIsAdmin(data === true);

      // If not an admin, don't load users
      if (!data) {
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
  }, []);

  const addAdminUser = useCallback(async (email: string): Promise<boolean> => {
    try {
      // First, check if the email is already in admin_users
      const { data: userData, error: userFetchError } = await supabase
        .from('admin_users')
        .select('id, email')
        .eq('email', email)
        .single();

      if (userFetchError || !userData) {
        // Instead of using the RPC function that's not in the type definitions,
        // let's use a direct query approach that accomplishes the same thing
        
        // Step 1: Find the user by email in the auth system
        // We can't query auth.users directly, but we can use a more generic approach
        // with the Supabase function API to call our function
        const { data: addedUser, error: functionError } = await supabase.functions.invoke('add-admin-user', {
          body: { email }
        });
        
        if (functionError) {
          toast.error('Add Admin Failed', {
            description: functionError.message
          });
          return false;
        }

        if (!addedUser || addedUser.error) {
          toast.error('User Not Found', {
            description: 'No user with this email exists. They must register first.'
          });
          return false;
        }

        toast.success('Admin Added', {
          description: `${email} has been granted admin access`
        });

        // Refresh the admin users list
        await checkAdminAndLoadUsers();
        return true;
      } else {
        // User already exists as admin
        toast.error('User Already Admin', {
          description: 'This email is already registered as an admin user'
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add admin';
      toast.error('Add Admin Failed', {
        description: errorMessage
      });
      return false;
    }
  }, [checkAdminAndLoadUsers]);

  const configurePermissions = useCallback(async () => {
    try {
      // Call a function to set up database permissions
      const { data, error } = await supabase.rpc('admin_bypass');
      
      if (error) {
        throw error;
      }

      toast.success('Permissions Configured', {
        description: 'Database access has been properly set up'
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Permission configuration failed';
      toast.error('Permissions Error', {
        description: errorMessage
      });
      return false;
    }
  }, []);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, [checkAdminAndLoadUsers]);

  return {
    adminUsers,
    isLoading,
    error,
    isAdmin,
    checkAdminAndLoadUsers,
    addAdminUser,
    configurePermissions
  };
};
