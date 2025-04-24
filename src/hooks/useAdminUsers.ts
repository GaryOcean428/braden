
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the AdminUser type instead of importing it
export interface AdminUser {
  id?: string;
  user_id?: string;
  email?: string;
  created_at?: string;
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
        created_at: user.created_at
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
      // First, get the user by email using a custom SQL query rather than RPC function
      const { data: userData, error: userFetchError } = await supabase
        .from('admin_users')
        .select('id, email')
        .eq('email', email)
        .single();

      if (userFetchError || !userData) {
        // If user not found as admin, try to add them directly
        // We'll check if they exist on the server side with RLS policies
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({ 
            email: email 
          });

        if (insertError) {
          toast.error('Add Admin Failed', {
            description: insertError.message
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
