import { createClient } from '@supabase/supabase-js';
import { StorageClient } from '@supabase/storage-js';
import type { Database } from './types';

// Get environment variables with fallbacks to hardcoded values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://iykrauzuutvmnxpqppzk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5a3JhdXp1dXR2bW54cHFwcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NzE1NjcsImV4cCI6MjA1MTQ0NzU2N30.kvAGD6FrOhmdpYzRHMyXam3p337w8Ijd5_raruHPd6U";

// Log for debugging
console.log('Supabase URL:', SUPABASE_URL);

// Create Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Create storage client
export const storage = new StorageClient(SUPABASE_URL, {
  apikey: SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  HERO_IMAGES: 'hero-images',
  CONTENT_IMAGES: 'content-images',
  PROFILE_IMAGES: 'profile-images',
};

// Helper function to initialize storage buckets
export const initializeStorageBuckets = async () => {
  try {
    // Check if buckets exist, create them if they don't
    for (const bucketName of Object.values(STORAGE_BUCKETS)) {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (error) {
          console.error(`Error creating bucket ${bucketName}:`, error);
        } else {
          console.log(`Created bucket: ${bucketName}`);
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    return { success: false, error };
  }
};
