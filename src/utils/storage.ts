
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StorageBucketName } from '@/integrations/supabase/storage';

/**
 * Ensures guest access for storage bucket operations
 */
export const ensureGuestAccess = async (bucketName: StorageBucketName) => {
  try {
    console.log(`Ensuring guest access for bucket: ${bucketName}`);
    
    // First try to see if we have a valid session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Active session found, using it for storage operations');
      console.log('User email:', session.user.email);
      return true;
    }
    
    console.log('No active session found, checking bucket accessibility');
    
    // Try to test bucket access directly
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Failed to list buckets:', listError);
        toast.error('Storage access error', { 
          description: 'Could not access storage buckets. Please sign in or contact support.' 
        });
        return false;
      }
      
      const bucketExists = buckets?.find(b => b.name === bucketName);
      if (!bucketExists) {
        console.error('Bucket does not exist:', bucketName);
        toast.error('Storage bucket error', { 
          description: `Storage bucket '${bucketName}' not found.` 
        });
        return false;
      }
      
      console.log('Bucket access confirmed without authentication');
      return true;
    } catch (directError) {
      console.error('Direct bucket access failed:', directError);
      
      // Fall back to edge function if available
      try {
        console.log('Attempting to ensure guest access via edge function');
        const { data, error } = await supabase.functions.invoke('ensure-guest-storage-access', {
          body: { bucket: bucketName }
        });
        
        if (error) {
          console.error('Edge function failed:', error);
          toast.error('Storage access error', { 
            description: 'Could not get permission to access storage. Please try signing in.' 
          });
          return false;
        }
        
        console.log('Guest access ensured successfully via edge function');
        return true;
      } catch (edgeFunctionError) {
        console.error('Edge function error:', edgeFunctionError);
        toast.error('Storage access error', { 
          description: 'Storage access service unavailable. Please try again later.' 
        });
        return false;
      }
    }
  } catch (error) {
    console.error('Error ensuring guest access:', error);
    toast.error('Storage access error', { 
      description: 'An unexpected error occurred while trying to access storage' 
    });
    return false;
  }
};

/**
 * Gets a public URL for a file in storage
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

/**
 * Debug storage permissions for troubleshooting
 */
export const debugStoragePermissions = async (bucketName: StorageBucketName) => {
  console.log('=== Storage Permissions Debug ===');
  
  try {
    // Check session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session status:', session ? 'Active' : 'None');
    if (session) {
      console.log('User email:', session.user.email);
      console.log('User ID:', session.user.id);
    }
    
    // Check bucket existence
    console.log('Checking bucket existence...');
    const { data: buckets, error: listBucketsError } = await supabase.storage.listBuckets();
    if (listBucketsError) {
      console.error('Failed to list buckets:', listBucketsError);
    } else {
      console.log('Available buckets:', buckets?.map(b => b.name));
      const targetBucket = buckets?.find(b => b.name === bucketName);
      console.log(`Target bucket '${bucketName}' exists:`, !!targetBucket);
      if (targetBucket) {
        console.log('Bucket details:', targetBucket);
      }
    }
    
    // Test list operation
    console.log(`Testing list operation on bucket '${bucketName}'...`);
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });
    
    if (listError) {
      console.error('List operation failed:', listError);
    } else {
      console.log('List operation successful, found', files?.length || 0, 'items');
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
  
  console.log('=== End Debug ===');
};
