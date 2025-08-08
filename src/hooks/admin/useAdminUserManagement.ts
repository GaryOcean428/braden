import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UseAdminUserManagementReturn {
  addAdminUser: (email: string) => Promise<boolean>;
  configurePermissions: () => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for admin user management operations
 */
export const useAdminUserManagement = (): UseAdminUserManagementReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAdminUser = useCallback(async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Adding admin user: ${email}`);

      // Call the edge function to add the admin user
      const { data, error } = await supabase.functions.invoke(
        'add-admin-user',
        {
          body: { email },
        }
      );

      if (error) {
        console.error('Edge function error:', error);
        toast.error('Add Admin Failed', {
          description: error.message,
        });
        setError(error.message);
        return false;
      }

      if (data.error) {
        console.error('Admin user creation error:', data.error);
        toast.error('Add Admin Failed', {
          description: data.error,
        });
        setError(data.error);
        return false;
      }

      // Success scenario
      if (data.message === 'User is already an admin') {
        toast.info('User Already Admin', {
          description: 'This email is already registered as an admin user',
        });
      } else {
        toast.success('Admin Added', {
          description: `${email} has been granted admin access`,
        });
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add admin';
      console.error('Add admin exception:', errorMessage);
      toast.error('Add Admin Failed', {
        description: errorMessage,
      });
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const configurePermissions = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Call a function to set up database permissions
      const { data, error } = await supabase.rpc('admin_bypass');

      if (error) {
        throw error;
      }

      toast.success('Permissions Configured', {
        description: 'Database access has been properly set up',
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Permission configuration failed';
      console.error('Permission configuration error:', errorMessage);
      toast.error('Permissions Error', {
        description: errorMessage,
      });
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addAdminUser,
    configurePermissions,
    loading,
    error,
  };
};
