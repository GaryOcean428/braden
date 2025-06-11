
import { supabase } from './client';

// Storage bucket names
export const STORAGE_BUCKETS = {
  HERO_IMAGES: 'hero-images',
  CONTENT_IMAGES: 'content-images',
  PROFILE_IMAGES: 'profile-images',
  MEDIA: 'media',
  LOGOS: 'logos',
  FAVICONS: 'favicons',
} as const;

// Define bucket name type for better type safety
export type StorageBucketName = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS] | string;

// Define the return types for better type safety
export type StorageBucketResult = {
  success: boolean;
  details?: Record<string, { success: boolean; error?: any }>;
  error?: any;
};

// Helper function to initialize storage buckets
export const initializeStorageBuckets = async (): Promise<StorageBucketResult> => {
  try {
    // Check if we have an active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return { 
        success: false, 
        error: "Authentication error: Please log in again" 
      };
    }
    
    if (!session) {
      console.warn('No active session found. Bucket creation requires authentication.');
      return { 
        success: false, 
        error: "Authentication required for storage configuration" 
      };
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User error:', userError);
      return {
        success: false,
        error: "Unable to get user information"
      };
    }

    // Check admin status using RLS function
    const { data: isAdminData, error: adminError } = await supabase
      .rpc('is_developer_admin');
    
    let isAdmin = false;
    if (adminError) {
      console.warn('Admin check failed, falling back to email check:', adminError);
      // Fallback to email check
      isAdmin = user.email === 'braden.lang77@gmail.com';
    } else {
      isAdmin = isAdminData === true;
    }
    
    if (!isAdmin) {
      console.warn('User does not have admin permissions:', user.email);
      return {
        success: false,
        error: "Admin permissions required for storage configuration"
      };
    }
    
    console.log('Admin access confirmed for user:', user.email);
    
    const results: Record<string, { success: boolean; error?: any }> = {};
    const bucketsToCreate = ['media', 'logos', 'favicons', 'content-images', 'hero-images', 'profile-images'];
    
    // Get list of existing buckets
    console.log('Listing existing buckets...');
    const { data: existingBuckets, error: bucketListError } = await supabase.storage.listBuckets();
    
    if (bucketListError) {
      console.error('Error listing buckets:', bucketListError);
      
      // Try to create buckets directly even if listing failed
      for (const bucketName of bucketsToCreate) {
        try {
          const { error } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });
          
          results[bucketName] = { 
            success: !error, 
            error: error?.message
          };
          
          if (error) {
            console.error(`Error creating bucket ${bucketName}:`, error);
          } else {
            console.log(`Created bucket: ${bucketName}`);
          }
        } catch (err) {
          results[bucketName] = { success: false, error: err };
          console.error(`Failed to create ${bucketName}:`, err);
        }
      }
      
      return {
        success: Object.values(results).some(r => r.success),
        details: results,
        error: `Bucket listing failed: ${bucketListError.message}`
      };
    }
    
    const existingBucketNames = existingBuckets?.map(b => b.name) || [];
    console.log('Existing buckets:', existingBucketNames);
    
    // Create any missing buckets
    for (const bucketName of bucketsToCreate) {
      try {
        if (!existingBucketNames.includes(bucketName)) {
          console.log(`Creating bucket: ${bucketName}`);
          const { error } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });
          
          if (error) {
            console.error(`Error creating bucket ${bucketName}:`, error);
            results[bucketName] = { success: false, error };
          } else {
            console.log(`Created bucket: ${bucketName}`);
            results[bucketName] = { success: true };
          }
        } else {
          console.log(`Bucket ${bucketName} already exists`);
          results[bucketName] = { success: true };
        }
      } catch (error) {
        console.error(`Error processing bucket ${bucketName}:`, error);
        results[bucketName] = { success: false, error };
      }
    }
    
    return { 
      success: Object.values(results).every(r => r.success),
      details: results
    };
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
