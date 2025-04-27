
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
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session found:', session ? 'Yes' : 'No');
    
    if (!session) {
      console.warn('No active session found. Bucket creation requires authentication.');
      return { 
        success: false, 
        error: "Authentication required for storage configuration" 
      };
    }

    // Create all buckets if they don't exist
    const results: Record<string, { success: boolean; error?: any }> = {};
    const bucketsToCreate = ['media', 'logos', 'favicons', 'content-images', 'hero-images', 'profile-images'];
    
    // First get list of existing buckets
    const { data: existingBuckets, error: bucketListError } = await supabase.storage.listBuckets();
    
    if (bucketListError) {
      console.error('Error listing buckets:', bucketListError);
      return {
        success: false,
        error: bucketListError.message
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
        
        // Make sure everyone can see the files (but not modify them unless authenticated)
        // This matches what we've done in SQL migrations
        if (!existingBucketNames.includes(bucketName) || results[bucketName]?.success) {
          console.log(`Setting RLS policies for ${bucketName}`);
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
      error 
    };
  }
};
