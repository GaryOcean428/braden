import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AdminRole, Permission } from '@/types/permissions';
import { useAdminStatus } from './admin/useAdminStatus';
import { usePermissionsFetch } from './admin/usePermissionsFetch';
import { usePermissionCheck } from './admin/usePermissionCheck';

interface UseAdminPermissionsReturn {
  isAdmin: boolean;
  isDeveloper: boolean;
  role: AdminRole | null;
  permissions: Permission[];
  loading: boolean;
  error: Error | null;
  checkPermission: (permission: Permission) => boolean;
  refreshPermissions: () => Promise<void>;
}

export function useAdminPermissions(): UseAdminPermissionsReturn {
  const {
    isAdmin,
    isDeveloper,
    role,
    loading: statusLoading,
    error: statusError,
    checkAdminStatus,
  } = useAdminStatus();

  const {
    permissions,
    loading: permissionsLoading,
    error: permissionsError,
    fetchPermissions,
  } = usePermissionsFetch();

  const { checkPermission } = usePermissionCheck();

  const loading = statusLoading || permissionsLoading;
  const error = statusError || permissionsError;

  // Load permissions when role changes or on manual refresh
  useEffect(() => {
    if (role) {
      // Developer admins get all permissions by default, no need to fetch
      if (isDeveloper) {
        return;
      }

      fetchPermissions(role).catch((err) => {
        console.error('Error fetching permissions:', err);
      });
    }
  }, [role, isDeveloper, fetchPermissions]);

  // Function to manually refresh permissions
  const refreshPermissions = useCallback(async () => {
    try {
      // First check admin status
      await checkAdminStatus();

      // Then fetch permissions if needed
      if (role && !isDeveloper) {
        await fetchPermissions(role);
      }
    } catch (err) {
      console.error('Error refreshing permissions:', err);
      toast.error('Permission Refresh Failed', {
        description: 'Could not update permission status',
      });
    }
  }, [checkAdminStatus, fetchPermissions, role, isDeveloper]);

  // Wrapper for permission check that uses internal state
  const checkUserPermission = useCallback(
    (permission: Permission): boolean => {
      // Developer and admin bypass all permission checks
      if (isDeveloper || isAdmin) return true;

      // Otherwise check against loaded permissions
      return checkPermission(permission, false, false, permissions);
    },
    [isDeveloper, isAdmin, permissions, checkPermission]
  );

  return {
    isAdmin,
    isDeveloper,
    role,
    permissions,
    loading,
    error,
    checkPermission: checkUserPermission,
    refreshPermissions,
  };
}
