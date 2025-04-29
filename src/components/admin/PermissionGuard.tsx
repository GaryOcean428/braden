import React from 'react';
import { Permission } from '@/types/permissions';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { checkPermission, loading, isDeveloper } = useAdminPermissions();

  if (loading) return null;
  
  // If user is a developer admin, they have all permissions
  if (isDeveloper) {
    return <>{children}</>;
  }
  
  // Otherwise check specific permission
  const hasPermission = checkPermission(permission);
  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
