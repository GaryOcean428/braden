import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ensureTaskTablesExist } from '@/lib/tasks/taskService';
import { toast } from 'sonner';

export function useSupabaseInitialization() {
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Check Supabase connection first
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // First check authentication status
        if (!session) {
          console.log('No authenticated session found');
          toast.info('Sign in to access all features', {
            description: 'Some features may be limited until you sign in',
          });
          return;
        }

        console.log(
          'Authenticated session found, checking database connection'
        );

        try {
          // Try to list existing buckets to verify storage access
          const { data: existingBuckets, error: listError } =
            await supabase.storage.listBuckets();

          if (listError) {
            console.error('Error listing buckets:', listError);

            // If we're authenticated as developer, inform about bucket permissions issue
            if (session.user.email === 'braden.lang77@gmail.com') {
              toast.warning('Storage permission issue', {
                description:
                  'Storage access is limited. Please check RLS policies.',
              });
            }
          } else {
            console.log(
              'Storage buckets retrieved:',
              existingBuckets?.map((b) => b.name)
            );

            // Check if all required buckets exist and are accessible
            const requiredBuckets = [
              'media',
              'logos',
              'favicons',
              'content-images',
              'hero-images',
              'profile-images',
            ];
            const existingBucketNames =
              existingBuckets?.map((b) => b.name) || [];

            const missingBuckets = requiredBuckets.filter(
              (name) => !existingBucketNames.includes(name)
            );

            if (missingBuckets.length > 0) {
              console.log(`Missing buckets: ${missingBuckets.join(', ')}`);

              // If authenticated as developer, provide more detailed message
              if (session.user.email === 'braden.lang77@gmail.com') {
                toast.warning('Storage initialization needed', {
                  description: `${missingBuckets.length} storage buckets need to be created`,
                });
              }
            } else {
              console.log('All required buckets exist');
            }
          }
        } catch (storageError) {
          console.error('Storage initialization error:', storageError);
        }

        // Ensure task tables exist regardless of storage status
        await ensureTaskTablesExist();
        console.log('Supabase tables initialized successfully');
      } catch (error) {
        console.error('Error initializing Supabase:', error);
        toast.error('Database initialization error', {
          description: 'Could not initialize required database tables',
        });
      }
    };

    initializeSupabase();
  }, []);
}
