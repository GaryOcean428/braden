
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminRole, Permission } from '@/types/permissions';

interface UsePermissionsFetchReturn {
  permissions: Permission[];
  loading: boolean;
  error: Error | null;
  fetchPermissions: (role: AdminRole | null) => Promise<Permission[]>;
}

/**
 * Hook for fetching user permissions based on role
 */
export function usePermissionsFetch(): UsePermissionsFetchReturn {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPermissions = useCallback(async (role: AdminRole | null): Promise<Permission[]> => {
    if (!role) {
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('permission_key')
        .eq('role', role);

      if (permissionsError) throw permissionsError;

      const formattedPermissions = permissionsData.map(p => p.permission_key as Permission);
      setPermissions(formattedPermissions);
      return formattedPermissions;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch permissions');
      console.error("Permissions fetch error:", error);
      setError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    permissions,
    loading,
    error,
    fetchPermissions
  };
}
