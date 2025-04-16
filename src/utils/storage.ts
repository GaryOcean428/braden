
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
      return true;
    }
    
    console.log('No active session found, using edge function for guest access');
    
    // Call a function to handle guest uploads
    const { data, error } = await supabase.functions.invoke('ensure-guest-storage-access', {
      body: { bucket: bucketName }
    });
    
    if (error) {
      console.error('Failed to ensure guest access:', error);
      toast.error('Storage access error', { 
        description: 'Could not get permission to access storage. Please try again or log in.' 
      });
      return false;
    }
    
    console.log('Guest access ensured successfully via edge function');
    return true;
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
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Generates a unique filename for upload
 */
export const generateUniqueFileName = (originalFileName: string, path?: string): { fileName: string, filePath: string } => {
  const fileExt = originalFileName.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = path ? `${path}/${fileName}` : fileName;
  
  return { fileName, filePath };
};
