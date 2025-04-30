
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UseAdminPermissionCheckReturn {
  isAdmin: boolean;
  isDeveloper: boolean;
  error: string | null;
  checkAdminStatus: () => Promise<boolean>;
  loading: boolean;
}

/**
 * Hook for checking if the current user has admin permissions
 */
export const useAdminPermissionCheck = (): UseAdminPermissionCheckReturn => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return false;
      }

      // Check developer status directly by email - most reliable method
      if (session.user.email === "braden.lang77@gmail.com") {
        console.log("Developer admin detected by direct email check");
        setIsDeveloper(true);
        setIsAdmin(true);
        return true;
      }
      
      // Fallback to RPC function for backward compatibility
      try {
        const { data: isDeveloperAdmin, error: adminCheckError } = await supabase.rpc('is_developer_admin');
        
        if (adminCheckError) {
          throw adminCheckError;
        }
        
        if (isDeveloperAdmin === true) {
          setIsDeveloper(true);
          setIsAdmin(true);
          return true;
        }
      } catch (err) {
        console.error("Error checking developer admin status:", err);
      }

      // Check if user is an admin
      try {
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (adminError) {
          throw adminError;
        }
        
        if (adminUser && adminUser.role === 'admin') {
          setIsAdmin(true);
          return true;
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      }

      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check admin status';
      console.error("Admin check error:", errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAdmin,
    isDeveloper,
    error,
    checkAdminStatus,
    loading
  };
};
