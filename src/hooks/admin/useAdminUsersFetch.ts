
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminRole } from '@/types/permissions';

export interface AdminUser {
  id?: string;
  user_id?: string;
  email?: string;
  created_at?: string;
  role?: AdminRole;
}

export interface UseAdminUsersFetchReturn {
  adminUsers: AdminUser[];
  fetchAdminUsers: () => Promise<AdminUser[]>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching admin users
 */
export const useAdminUsersFetch = (): UseAdminUsersFetchReturn => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminUsers = useCallback(async (): Promise<AdminUser[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: adminUsersData, error: fetchError } = await supabase
        .from('admin_users')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      // Format the admin users with correct types
      const formattedAdminUsers = adminUsersData ? adminUsersData.map(user => ({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        created_at: user.created_at,
        role: user.role as AdminRole
      })) : [];
      
      setAdminUsers(formattedAdminUsers);
      return formattedAdminUsers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin users';
      console.error("Error fetching admin users:", errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    adminUsers,
    fetchAdminUsers,
    loading,
    error
  };
};
