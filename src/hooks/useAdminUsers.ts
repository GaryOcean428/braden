
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useAdminPermissionCheck } from './admin/useAdminPermissionCheck';
import { useAdminUsersFetch, AdminUser } from './admin/useAdminUsersFetch';
import { useAdminUserManagement } from './admin/useAdminUserManagement';

export type { AdminUser } from './admin/useAdminUsersFetch';

export const useAdminUsers = () => {
  const [error, setError] = useState<string | null>(null);
  
  // Compose specialized hooks
  const { 
    isAdmin, 
    isDeveloper,
    checkAdminStatus,
    loading: permissionLoading
  } = useAdminPermissionCheck();
  
  const {
    adminUsers,
    fetchAdminUsers,
    loading: fetchLoading
  } = useAdminUsersFetch();
  
  const {
    addAdminUser,
    configurePermissions,
    loading: managementLoading
  } = useAdminUserManagement();
  
  const isLoading = permissionLoading || fetchLoading || managementLoading;

  const checkAdminAndLoadUsers = useCallback(async () => {
    try {
      setError(null);
      const hasAdminAccess = await checkAdminStatus();
      
      // Only fetch admin users if the user is an admin or developer
      if (hasAdminAccess) {
        await fetchAdminUsers();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Admin Access Error', {
        description: errorMessage
      });
    }
  }, [checkAdminStatus, fetchAdminUsers]);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, [checkAdminAndLoadUsers]);

  return {
    adminUsers,
    isLoading,
    error,
    isAdmin,
    isDeveloper,
    checkAdminAndLoadUsers,
    addAdminUser,
    configurePermissions
  };
};
