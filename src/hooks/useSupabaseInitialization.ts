
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

        // Check if user is dev admin by email - most reliable method
        const { data: { session } } = await supabase.auth.getSession();
        const userEmail = session?.user?.email;
        
        if (userEmail === 'braden.lang77@gmail.com') {
          console.log('Developer admin detected, proceeding with storage initialization');
          
          try {
            // Use a direct fetch to the Supabase API to ensure buckets exist
            // This avoids RLS issues when using the storage API
            const { data: existingBuckets } = await supabase.storage.listBuckets();
            
            console.log('Storage buckets retrieved:', existingBuckets?.map(b => b.name));
            
            // Ensure task tables exist after confirming connection
            await ensureTaskTablesExist();
            console.log('Supabase tables initialized successfully');
          } catch (storageError) {
            console.error('Storage initialization error:', storageError);
            // Continue with application initialization despite storage issues
          }
        } else {
          // Regular user initialization
          await ensureTaskTablesExist();
          console.log('Supabase tables initialized successfully for regular user');
        }
      } catch (error) {
        console.error('Error initializing Supabase:', error);
        toast.error('Database initialization error', {
          description: 'Could not initialize required database tables'
        });
      }
    };

    initializeSupabase();
  }, []);
}
