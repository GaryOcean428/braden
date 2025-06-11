
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminRole } from '@/types/permissions';
import { RoleManager } from '@/utils/roleManager';

interface UseAdminStatusReturn {
  isAdmin: boolean;
  isDeveloper: boolean;
  role: AdminRole | null;
  loading: boolean;
  error: Error | null;
  checkAdminStatus: () => Promise<void>;
}

/**
 * Hook for checking admin and developer status
 */
export function useAdminStatus(): UseAdminStatusReturn {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkAdminStatus = useCallback(async () => {
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

      // Use centralized role manager instead of hard-coded checks
      const userRole = await RoleManager.checkUserRole();
      
      setIsDeveloper(userRole.isDeveloper);
      setIsAdmin(userRole.isAdmin);
      setRole(userRole.role);
      
      if (userRole.isDeveloper) {
        console.log('Developer access confirmed');
      } else if (userRole.isAdmin) {
        console.log('Admin access confirmed');
      } else {
        console.log('No admin access');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check admin status');
      console.error("Admin check error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return { 
    isAdmin, 
    isDeveloper,
    role,
    loading, 
    error,
    checkAdminStatus
  };
}
