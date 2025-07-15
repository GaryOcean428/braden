import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RoleManager } from '@/utils/roleManager';

export interface UseAdminPermissionCheckReturn {
  isAdmin: boolean;
  isDeveloper: boolean;
  error: string | null;
  checkAdminStatus: () => Promise<boolean>;
  loading: boolean;
}

/**
 * Hook for checking if the current user has admin permissions
 */
export const useAdminPermissionCheck = (): UseAdminPermissionCheckReturn => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return false;
      }

      // Use centralized role manager instead of hard-coded checks
      const userRole = await RoleManager.checkUserRole();

      setIsDeveloper(userRole.isDeveloper);
      setIsAdmin(userRole.isAdmin);

      if (userRole.isDeveloper) {
        console.log('Developer admin detected');
        return true;
      }

      if (userRole.isAdmin) {
        console.log('Admin access confirmed');
        return true;
      }

      console.log('No admin access');
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to check admin status';
      console.error('Admin check error:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAdmin,
    isDeveloper,
    error,
    checkAdminStatus,
    loading,
  };
};
