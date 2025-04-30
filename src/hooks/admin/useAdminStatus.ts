
import { useState, useEffect } from 'react';
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
        return;
      }
      
      // Check if user ID matches the developer ID - secondary method
      if (session.user.id === '9600a18c-c8e3-44ef-83ad-99ede9268e77') {
        console.log('Developer detected by ID');
        setIsDeveloper(true);
        setIsAdmin(true);
        setRole('admin');
        return;
      }
      
      // Fallback to using the RPC function
      try {
        const { data: isDeveloperAdmin, error: developerError } = await supabase.rpc('admin_bypass');
        
        if (!developerError && isDeveloperAdmin === true) {
          console.log("Developer access confirmed by RPC function");
          setIsDeveloper(true);
          setIsAdmin(true);
          setRole('admin');
          return;
        }
      } catch (err) {
        console.error('Developer RPC check failed:', err);
        // Continue with regular admin check
      }

      // Get user's role from admin_users table
      try {
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (adminError) {
          console.error('Admin role check error:', adminError);
        } else if (adminUser) {
          console.log('Admin role found:', adminUser.role);
          setRole(adminUser.role as AdminRole);
          setIsAdmin(adminUser.role === 'admin');
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

  useEffect(() => {
    checkAdminStatus();
  }, []);

  return { 
    isAdmin, 
    isDeveloper,
    role,
    loading, 
    error,
    checkAdminStatus
  };
}
