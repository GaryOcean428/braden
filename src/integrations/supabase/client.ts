import { createClient } from '@supabase/supabase-js';
import { StorageClient } from '@supabase/storage-js';
import type { Database } from './types';

// Get environment variables with fallbacks to hardcoded values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://iykrauzuutvmnxpqppzk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5a3JhdXp1dXR2bW54cHFwcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NzE1NjcsImV4cCI6MjA1MTQ0NzU2N30.kvAGD6FrOhmdpYzRHMyXam3p337w8Ijd5_raruHPd6U";

// Log for debugging
console.log('Supabase URL:', SUPABASE_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('Auth Configuration: Using enhanced settings for SPA');

// Create Supabase client with comprehensive options for auth in SPA
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'braden-auth-token',
    storage: {
      getItem: (key) => {
        try {
          const storedValue = window.localStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
        } catch (error) {
          console.error('Error retrieving auth from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error storing auth in localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing auth from localStorage:', error);
        }
      }
    },
    flowType: 'pkce', // More secure flow for SPAs
    debug: true // Enable debug mode in production to help diagnose issues
  },
  global: {
    headers: {
      'X-Client-Info': 'braden-website'
    }
  }
});

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
          
          // Set RLS policies for the bucket to allow authenticated users to perform operations
          await setupBucketPolicies(bucketName);
        }
      } else {
        // Ensure policies are set for existing buckets
        await setupBucketPolicies(bucketName);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    return { success: false, error };
  }
};

// Helper function to set up RLS policies for a bucket
const setupBucketPolicies = async (bucketName: string) => {
  try {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.warn('No active session found, cannot set bucket policies');
      return { success: false };
    }
    
    // Create SQL to set up RLS policies for the bucket
    const { error } = await supabase.rpc('setup_storage_policies', {
      bucket_name: bucketName
    });
    
    if (error) {
      console.error(`Error setting up policies for bucket ${bucketName}:`, error);
      return { success: false, error };
    }
    
    console.log(`Set up policies for bucket: ${bucketName}`);
    return { success: true };
  } catch (error) {
    console.error(`Error setting up policies for bucket ${bucketName}:`, error);
    return { success: false, error };
  }
};

// Function to create a default admin user if none exists
export const ensureAdminUser = async () => {
  try {
    // Check if we have an active session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Active session found, no need to create admin user');
      return { success: true };
    }
    
    // Try to sign in with default admin credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'Admin123!',
    });
    
    if (error && error.status === 400) {
      // User doesn't exist, create it
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'Admin123!',
        options: {
          data: {
            role: 'admin',
          }
        }
      });
      
      if (signUpError) {
        console.error('Error creating admin user:', signUpError);
        return { success: false, error: signUpError };
      }
      
      console.log('Created default admin user');
      return { success: true, data: signUpData };
    } else if (error) {
      console.error('Error checking for admin user:', error);
      return { success: false, error };
    }
    
    console.log('Signed in with existing admin user');
    return { success: true, data };
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    return { success: false, error };
  }
};
