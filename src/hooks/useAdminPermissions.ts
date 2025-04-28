
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminRole, Permission } from '@/types/permissions';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        setLoading(false);
        return;
      }

      // Check if user is the developer admin
      const { data: isDeveloperAdmin, error: developerError } = await supabase.rpc('is_developer_admin');
      
      if (developerError) throw developerError;
      
      setIsDeveloper(isDeveloperAdmin === true);

      if (isDeveloperAdmin) {
        setIsAdmin(true);
        setRole('admin');
        // Developer admin has all permissions
        setPermissions([
          'users.view', 'users.create', 'users.edit', 'users.delete',
          'content.view', 'content.create', 'content.edit', 'content.delete',
          'site.edit', 'clients.view', 'clients.manage', 'leads.view', 'leads.manage'
        ] as Permission[]);
        return;
      }

      // Get user's role and permissions
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (adminError) throw adminError;

      if (adminUser) {
        setRole(adminUser.role as AdminRole);
        setIsAdmin(adminUser.role === 'admin');

        // Fetch user's permissions based on their role
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissions')
          .select('permission_key')
          .eq('role', adminUser.role);

        if (permissionsError) throw permissionsError;

        setPermissions(permissionsData.map(p => p.permission_key as Permission));
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check admin status');
      console.error("Admin check error:", error);
      setError(error);
      toast.error("Permission Check Failed", {
        description: "Could not verify your admin status"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = (permission: Permission): boolean => {
    if (isDeveloper || role === 'admin') return true;
    return permissions.includes(permission);
  };

  return { 
    isAdmin, 
    isDeveloper,
    role, 
    permissions, 
    loading, 
    error,
    checkPermission 
  };
}
