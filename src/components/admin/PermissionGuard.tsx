
import React from 'react';
import { Permission } from '@/types/permissions';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { checkPermission, loading } = useAdminPermissions();

  if (loading) return null;
  
  if (!checkPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
