import React, { useState, useEffect } from 'react';
import { Permission } from '@/types/permissions';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { checkPermission, loading, isDeveloper, isAdmin } = useAdminPermissions();
  const [hasAccess, setHasAccess] = useState(false);

  // Effect to set access status once loading is complete
  useEffect(() => {
    if (!loading) {
      // Always grant access to developer admin first (fail-safe approach)
      if (isDeveloper || isAdmin) {
        setHasAccess(true);
        return;
      }
      
      // Otherwise check specific permission
      const permissionGranted = checkPermission(permission);
      setHasAccess(permissionGranted);
    }
  }, [loading, isDeveloper, isAdmin, permission, checkPermission]);

  // If still loading, don't render anything
  if (loading) return null;
  
  // Render based on access status
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
