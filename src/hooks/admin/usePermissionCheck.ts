
import { useCallback } from 'react';
import { Permission } from '@/types/permissions';

interface UsePermissionCheckReturn {
  checkPermission: (permission: Permission, isDeveloper: boolean, isAdmin: boolean, userPermissions: Permission[]) => boolean;
}

/**
 * Hook for checking if a user has a specific permission
 */
export function usePermissionCheck(): UsePermissionCheckReturn {
  // Simplified synchronous permission check
  const checkPermission = useCallback(
    (
      permission: Permission,
      isDeveloper: boolean,
      isAdmin: boolean,
      userPermissions: Permission[]
    ): boolean => {
      // Developer or admin always has all permissions
      if (isDeveloper || isAdmin) return true;
      
      // Check if the user has the specific permission
      return userPermissions.includes(permission);
    },
    []
  );

  return { checkPermission };
}
