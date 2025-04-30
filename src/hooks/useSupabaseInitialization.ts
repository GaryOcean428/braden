
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
            // Call admin_bypass RPC function to temporarily elevate permissions
            const { data: adminBypass, error: bypassError } = await supabase.rpc('admin_bypass');
            
            if (bypassError) {
              console.error('Admin bypass error:', bypassError);
            } else {
              console.log('Admin bypass successful:', adminBypass);
            }
            
            // Try to list existing buckets to check connection
            const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
            
            if (listError) {
              console.error('Error listing buckets:', listError);
              // Don't try to create buckets if we can't list them
            } else {
              console.log('Storage buckets retrieved:', existingBuckets?.map(b => b.name));
              
              // Create buckets using a try-catch for each one to handle existing buckets
              const requiredBuckets = ['media', 'logos', 'favicons', 'content-images', 'hero-images', 'profile-images'];
              const existingBucketNames = existingBuckets?.map(b => b.name) || [];
              
              for (const bucketName of requiredBuckets) {
                if (!existingBucketNames.includes(bucketName)) {
                  try {
                    await supabase.storage.createBucket(bucketName, {
                      public: true,
                      fileSizeLimit: 10485760 // 10MB
                    });
                    console.log(`Created bucket: ${bucketName}`);
                  } catch (createErr) {
                    // If error says bucket already exists, that's fine
                    console.warn(`Could not create bucket ${bucketName}:`, createErr);
                  }
                }
              }
            }
            
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
