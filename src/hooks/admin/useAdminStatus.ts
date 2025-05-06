
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminRole } from '@/types/permissions';

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

      // PRIMARY CHECK: Check if the user email is the developer email - most reliable method
      const userEmail = session.user.email;
      
      if (userEmail === 'braden.lang77@gmail.com') {
        console.log('Developer detected by email');
        setIsDeveloper(true);
        setIsAdmin(true);
        setRole('admin');
        setLoading(false);
        return;
      }
      
      // SECONDARY CHECK: Try multiple methods to verify developer status
      const promises = [];
      
      // Method 1: Check if user ID matches the developer ID
      if (session.user.id === '9600a18c-c8e3-44ef-83ad-99ede9268e77') {
        console.log('Developer detected by ID');
        setIsDeveloper(true);
        setIsAdmin(true);
        setRole('admin');
        setLoading(false);
        return;
      }
      
      // Method 2: Use the admin_bypass function
      try {
        const { data: isBypassAllowed, error: bypassError } = await supabase.rpc('admin_bypass');
        
        if (!bypassError && isBypassAllowed === true) {
          console.log("Developer access confirmed by admin_bypass function");
          setIsDeveloper(true);
          setIsAdmin(true);
          setRole('admin');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Failed to check admin_bypass:', err);
        // Continue with other methods
      }
      
      // Method 3: Fallback check against admin_users table
      try {
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (adminError) {
          console.warn('Error checking admin_users table:', adminError);
        } else if (adminUser) {
          console.log('Admin role found:', adminUser.role);
          setRole(adminUser.role as AdminRole);
          setIsAdmin(adminUser.role === 'admin');
        }
      } catch (err) {
        console.warn('Admin permissions check error:', err);
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
