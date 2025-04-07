import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ensureTaskTablesExist } from '@/lib/tasks/taskService';

export function useSupabaseInitialization() {
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Ensure all required tables exist
        await ensureTaskTablesExist();
        console.log('Supabase tables initialized successfully');
      } catch (error) {
        console.error('Error initializing Supabase tables:', error);
      }
    };

    initializeSupabase();
  }, []);
}
