import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminUsers = () => {
  const [data, setData]   = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchAdmins = async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*');

      if (ignore) return;

      if (error) setError(error.message);
      else setData(data || []);

      setLoading(false);
    };

    fetchAdmins();
    return () => { ignore = true; };
  }, []);

  return { data, error, loading };
};