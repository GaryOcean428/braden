
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ensureTaskTablesExist } from '@/lib/tasks/taskService';
import { toast } from 'sonner';

export function useSupabaseInitialization() {
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Check Supabase connection first
        const { data: connectionTest, error: connectionError } = await supabase
          .from('content_pages')
          .select('count(*)', { count: 'exact', head: true });

        if (connectionError) {
          console.error('Supabase connection error:', connectionError);
          
          // Provide detailed error information for debugging
          if (connectionError.code === '42501') {
            console.warn('Permission denied error detected. This is likely an RLS policy issue.');
            toast.error('Database permission error', {
              description: 'RLS policies may be preventing access to tables'
            });
          } else if (connectionError.code === 'PGRST116') {
            console.warn('Foreign key violation or constraint error');
          } else if (connectionError.message?.includes('JWT')) {
            console.warn('Authentication token issue detected');
            toast.error('Authentication error', {
              description: 'Please try logging in again'
            });
          }
        } else {
          console.log('Supabase connection successful');
        }

        // Ensure all required tables exist
        await ensureTaskTablesExist();
        console.log('Supabase tables initialized successfully');
      } catch (error) {
        console.error('Error initializing Supabase tables:', error);
        toast.error('Database initialization error', {
          description: 'Could not initialize required database tables'
        });
      }
    };

    initializeSupabase();
  }, []);
}
