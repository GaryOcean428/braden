
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAdminPermissions() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: isAdminUser, error: adminError } = await supabase.rpc('is_developer_admin');
      
      if (adminError) {
        throw adminError;
      }

      setIsAdmin(isAdminUser === true);
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

  return { isAdmin, loading, error, checkAdminStatus };
}
