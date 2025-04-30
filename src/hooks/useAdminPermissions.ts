
import { useState, useEffect } from 'react';
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
}

export function useAdminPermissions(): UseAdminPermissionsReturn {
  const { 
    isAdmin, 
    isDeveloper, 
    role, 
    loading: statusLoading, 
    error: statusError,
    checkAdminStatus
  } = useAdminStatus();
  
  const {
    permissions,
    loading: permissionsLoading,
    error: permissionsError,
    fetchPermissions
  } = usePermissionsFetch();
  
  const { checkPermission } = usePermissionCheck();
  
  const loading = statusLoading || permissionsLoading;
  const error = statusError || permissionsError;
  
  // Load permissions when role changes
  useEffect(() => {
    if (role) {
      // Developer admins get all permissions by default, no need to fetch
      if (isDeveloper) {
        return;
      }
      
      fetchPermissions(role);
    }
  }, [role, isDeveloper, fetchPermissions]);
  
  // Wrapper for permission check that uses internal state
  const checkUserPermission = (permission: Permission): boolean => {
    return checkPermission(permission, isDeveloper, isAdmin, permissions);
  };

  return { 
    isAdmin, 
    isDeveloper,
    role, 
    permissions, 
    loading, 
    error,
    checkPermission: checkUserPermission
  };
}
