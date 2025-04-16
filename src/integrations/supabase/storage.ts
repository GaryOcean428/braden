
import { StorageClient } from '@supabase/storage-js';
import { supabase } from './auth';

// Create storage client
export const storage = new StorageClient("https://iykrauzuutvmnxpqppzk.supabase.co", {
  apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5a3JhdXp1dXR2bW54cHFwcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NzE1NjcsImV4cCI6MjA1MTQ0NzU2N30.kvAGD6FrOhmdpYzRHMyXam3p337w8Ijd5_raruHPd6U",
  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5a3JhdXp1dXR2bW54cHFwcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NzE1NjcsImV4cCI6MjA1MTQ0NzU2N30.kvAGD6FrOhmdpYzRHMyXam3p337w8Ijd5_raruHPd6U`,
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  HERO_IMAGES: 'hero-images',
  CONTENT_IMAGES: 'content-images',
  PROFILE_IMAGES: 'profile-images',
  MEDIA: 'media',
} as const;

// Define bucket name type for better type safety
export type StorageBucketName = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

// Define the return types for better type safety
export type StorageBucketResult = {
  success: boolean;
  details?: Record<string, { success: boolean; error?: any }>;
  error?: any;
};

// Fallback function to create buckets via edge function
const createBucketsViaEdgeFunction = async (): Promise<StorageBucketResult> => {
  try {
    console.log('Attempting to create buckets via edge function...');
    
    // Call edge function to set up storage buckets and policies
    const result: Record<string, { success: boolean; error?: any }> = {};
    
    for (const bucketName of Object.values(STORAGE_BUCKETS)) {
      const { data, error } = await supabase.functions.invoke('ensure-guest-storage-access', {
        body: { bucket: bucketName }
      });
      
      if (error) {
        console.error(`Error creating bucket ${bucketName} via edge function:`, error);
        result[bucketName] = { success: false, error };
      } else {
        console.log(`Successfully set up bucket ${bucketName} via edge function`);
        result[bucketName] = { success: true };
      }
    }
    
    return { 
      success: true, 
      details: result 
    };
  } catch (error) {
    console.error('Edge function bucket creation failed:', error);
    return { 
      success: false, 
      error 
    };
  }
};

// Helper function to initialize storage buckets
export const initializeStorageBuckets = async (): Promise<StorageBucketResult> => {
  try {
    // Check if we have an active session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session found:', session ? 'Yes' : 'No');
    
    if (!session) {
      console.warn('No active session found. Bucket creation requires authentication.');
      // Attempt to use admin auth for bucket creation via edge function
      return await createBucketsViaEdgeFunction();
    }
    
    // Check if buckets exist, create them if they don't
    for (const bucketName of Object.values(STORAGE_BUCKETS)) {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Creating bucket: ${bucketName}`);
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (error) {
          console.error(`Error creating bucket ${bucketName}:`, error);
          if (error.message.includes('row level security policy')) {
            console.warn('RLS policy preventing bucket creation. Trying edge function...');
            return await createBucketsViaEdgeFunction();
          }
        } else {
          console.log(`Created bucket: ${bucketName}`);
        }
      } else {
        console.log(`Bucket ${bucketName} already exists`);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    // If any error occurs, try the edge function as a fallback
    return await createBucketsViaEdgeFunction();
  }
};
