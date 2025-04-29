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

      // Check if the user email is the developer email - most reliable method
      const userEmail = session.user.email;
      
      if (userEmail === 'braden.lang77@gmail.com') {
        console.log('Developer detected by email');
        setIsDeveloper(true);
        setIsAdmin(true);
        setRole('admin');
        
        // Developer has all permissions
        setPermissions([
          'users.view', 'users.create', 'users.edit', 'users.delete',
          'content.view', 'content.create', 'content.edit', 'content.delete',
          'site.edit', 'clients.view', 'clients.manage', 'leads.view', 'leads.manage'
        ] as Permission[]);
        
        setLoading(false);
        return;
      }
      
      // Fallback to using the RPC function
      try {
        // Check if user is the developer admin
        const { data: isDeveloperAdmin, error: developerError } = await supabase.rpc('is_developer_admin');
        
        if (developerError) {
          console.error('Developer check error:', developerError);
        } else if (isDeveloperAdmin === true) {
          setIsDeveloper(true);
          setIsAdmin(true);
          setRole('admin');
          
          // Developer admin has all permissions
          setPermissions([
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'content.view', 'content.create', 'content.edit', 'content.delete',
            'site.edit', 'clients.view', 'clients.manage', 'leads.view', 'leads.manage'
          ] as Permission[]);
          
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Developer RPC check failed:', err);
        // Continue with regular admin check
      }

      // Get user's role and permissions
      try {
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (adminError) {
          if (adminError.code === 'PGRST116') {
            // No data found - not an admin
            setLoading(false);
            return;
          }
          throw adminError;
        }

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
        console.error('Admin permissions check error:', err);
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

  const checkPermission = async (permission: Permission): Promise<boolean> => {
    if (isDeveloper || role === 'admin') return true;

    try {
      const { data: hasPermission, error } = await supabase.rpc('check_permission', {
        user_id: supabase.auth.user()?.id,
        resource_type: 'general',
        resource_id: null,
        action: permission
      });

      if (error) {
        console.error('Permission check error:', error);
        return false;
      }

      return hasPermission;
    } catch (err) {
      console.error('Permission check failed:', err);
      return false;
    }
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
