
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ensureGuestAccess, generateUniqueFileName, getPublicUrl } from '@/utils/storage';

export const useUploadFile = (bucketName: string) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadFile = async (file: File, path?: string) => {
    if (!file) return null;
    
    try {
      setUploading(true);
      setError(null);
      
      // Create a unique file name
      const { filePath } = generateUniqueFileName(file.name, path);
      
      // Attempt to get session, but proceed with upload regardless
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthenticated = !!session;
      
      console.log(`Upload initiated${isAuthenticated ? ' with authentication' : ' without authentication'}`);
      
      // Upload file to Supabase Storage
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      let uploadData = uploadResult.data;
      const uploadError = uploadResult.error;
      
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        
        if (uploadError.message.includes('row level security')) {
          // Attempt to sign in as admin for this upload
          console.log('Attempting admin sign in for upload...');
          const adminResult = await ensureGuestAccess(bucketName);
          
          if (adminResult) {
            // Retry upload
            const retryResult = await supabase.storage
              .from(bucketName)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
              });
              
            if (retryResult.error) {
              console.error('Retry upload failed:', retryResult.error);
              throw retryResult.error;
            }
            
            uploadData = retryResult.data;
            console.log('Upload succeeded after admin sign in');
          } else {
            throw uploadError;
          }
        } else {
          throw uploadError;
        }
      }
      
      if (!uploadData) {
        throw new Error('Upload failed: no data returned');
      }
      
      // Get public URL
      const publicUrl = getPublicUrl(bucketName, uploadData.path);
      
      setUploadedUrl(publicUrl);
      toast.success('File uploaded successfully');
      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during upload'));
      toast.error("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    error,
    uploadedUrl
  };
};
