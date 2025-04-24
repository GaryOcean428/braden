
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/types'; // Import Json type for safer type handling

interface UserData {
  id?: string;
  email?: string;
}

export const useAdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<UserData[]>([]);
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
        .select('*, user_id(email)');

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to ensure correct typing
      const formattedAdminUsers = adminUsersData.map(user => ({
        id: user.user_id?.id,
        email: user.user_id?.email
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
      // First, get the user by email using the custom function
      const { data, error: userFetchError } = await supabase
        .rpc('get_user_by_email', { email_input: email });

      if (userFetchError || !data) {
        toast.error('User Not Found', {
          description: 'No user found with this email. They must register first.'
        });
        return false;
      }

      // Then add the user to admin_users table
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({ user_id: data.id, email });

      if (insertError) {
        throw insertError;
      }

      toast.success('Admin Added', {
        description: `${email} has been granted admin access`
      });

      // Refresh the admin users list
      await checkAdminAndLoadUsers();
      return true;
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
