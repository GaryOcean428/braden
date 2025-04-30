
import { useCallback } from 'react';
import { Permission } from '@/types/permissions';

interface UsePermissionCheckReturn {
  checkPermission: (permission: Permission, isDeveloper: boolean, isAdmin: boolean, userPermissions: Permission[]) => boolean;
}

/**
 * Hook for checking if a user has a specific permission
 */
export function usePermissionCheck(): UsePermissionCheckReturn {
  // Enhanced permission check with better developer recognition
  const checkPermission = useCallback(
    (
      permission: Permission,
      isDeveloper: boolean,
      isAdmin: boolean,
      userPermissions: Permission[]
    ): boolean => {
      // Developer always has all permissions (most important rule)
      if (isDeveloper) return true;
      
      // Admin always has all permissions (secondary rule)
      if (isAdmin) return true;
      
      // Check if the user has the specific permission
      return userPermissions.includes(permission);
    },
    []
  );

  return { checkPermission };
}
