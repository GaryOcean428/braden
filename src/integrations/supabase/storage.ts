
import { supabase } from './client';

export const STORAGE_BUCKETS = {
  MEDIA: 'media',
  HERO_IMAGES: 'hero-images',
  CONTENT_IMAGES: 'content-images',
  PROFILE_IMAGES: 'profile-images',
  LOGOS: 'logos',
  FAVICONS: 'favicons'
} as const;

export type StorageBucketName = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

/**
 * Initialize storage buckets - simplified to just verify access
 */
export const initializeStorageBuckets = async () => {
  try {
    console.log('Initializing storage buckets...');
    
    // Check if we have a valid session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return { success: false, error: 'Session error' };
    }

    if (!session) {
      console.log('No active session found. Storage operations may be limited.');
      return { success: true, message: 'No session - limited access mode' };
    }

    console.log('Session found:', session.user.email);

    // Simply verify we can list buckets (no need to create them)
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return { success: false, error: 'Cannot access storage buckets' };
      }

      console.log('Available buckets:', buckets?.map(b => b.name) || []);
      
      // Check if our required buckets exist
      const requiredBuckets = Object.values(STORAGE_BUCKETS);
      const existingBuckets = buckets?.map(b => b.name) || [];
      const missingBuckets = requiredBuckets.filter(bucket => !existingBuckets.includes(bucket));
      
      if (missingBuckets.length > 0) {
        console.warn('Some buckets are missing:', missingBuckets);
        return { 
          success: true, 
          warning: `Some buckets missing: ${missingBuckets.join(', ')}` 
        };
      }

      console.log('All required storage buckets are available');
      return { success: true, message: 'Storage initialized successfully' };

    } catch (bucketError) {
      console.error('Bucket access error:', bucketError);
      return { success: false, error: 'Storage access error' };
    }

  } catch (error) {
    console.error('Storage initialization failed:', error);
    return { success: false, error: 'Initialization failed' };
  }
};

/**
 * Get a public URL for a file in storage
 */
export const getPublicUrl = (bucketName: StorageBucketName, path: string): string => {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);
    
    console.log(`Generated public URL for ${bucketName}/${path}:`, data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Error generating public URL:', error);
    return '';
  }
};

/**
 * Generates a unique filename for upload
 */
export const generateUniqueFileName = (originalFileName: string, path?: string): { fileName: string, filePath: string } => {
  const fileExt = originalFileName.split('.').pop() || '';
  const baseName = originalFileName.replace(/\.[^/.]+$/, '');
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  
  const fileName = `${baseName}_${timestamp}_${randomId}.${fileExt}`;
  const filePath = path ? `${path}/${fileName}` : fileName;
  
  console.log(`Generated unique filename: ${fileName} -> ${filePath}`);
  
  return { fileName, filePath };
};
