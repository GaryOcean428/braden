
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Ensures guest access for storage bucket operations
 */
export const ensureGuestAccess = async (bucketName: string) => {
  try {
    // Call a function to handle guest uploads temporarily
    const { error } = await supabase.functions.invoke('ensure-guest-storage-access', {
      body: { bucket: bucketName }
    });
    
    if (error) {
      console.error('Failed to ensure guest access:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring guest access:', error);
    return false;
  }
};

/**
 * Gets a public URL for a file in storage
 */
export const getPublicUrl = (bucketName: string, path: string): string => {
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
