import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateUniqueFileName, getPublicUrl } from '@/utils/storage';
import { StorageBucketName } from '@/integrations/supabase/storage';

export const useUploadFile = (bucketName: StorageBucketName) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadFile = async (file: File, path?: string) => {
    if (!file) return null;

    try {
      setUploading(true);
      setError(null);
      setUploadedUrl(null);

      console.log(`Starting upload of ${file.name} to bucket ${bucketName}`);

      // Create a unique file name
      const { filePath } = generateUniqueFileName(file.name, path);

      // Check authentication status
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isAuthenticated = !!session;

      console.log(
        `Upload initiated${isAuthenticated ? ' with authentication' : ' without authentication'}`
      );
      console.log('Session user:', session?.user?.email);

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        console.error('Upload error message:', uploadError.message);

        // Provide more specific error messages based on common storage error patterns
        if (
          uploadError.message.includes('row level security') ||
          uploadError.message.includes('permission denied') ||
          uploadError.message.includes('access control')
        ) {
          toast.error('Permission Error', {
            description:
              'You do not have permission to upload files to this bucket. Please check your access rights.',
          });
        } else if (uploadError.message.includes('file size')) {
          toast.error('File Too Large', {
            description:
              'The file you are trying to upload exceeds the maximum size limit.',
          });
        } else if (uploadError.message.includes('mime type')) {
          toast.error('Invalid File Type', {
            description:
              'This file type is not allowed. Please upload an image file.',
          });
        } else {
          toast.error('Upload Failed', {
            description: uploadError.message || 'Unknown error during upload',
          });
        }
        throw uploadError;
      }

      if (!uploadData) {
        const errorMsg = 'Upload failed: no data returned';
        console.error(errorMsg);
        toast.error('Upload Failed', { description: errorMsg });
        throw new Error(errorMsg);
      }

      console.log('Upload successful:', uploadData.path);

      // Get public URL
      const publicUrl = getPublicUrl(bucketName, uploadData.path);
      console.log('Generated public URL:', publicUrl);

      setUploadedUrl(publicUrl);
      toast.success('File uploaded successfully', {
        description: `${file.name} has been uploaded successfully`,
      });

      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      const errorObj =
        err instanceof Error ? err : new Error('Unknown error during upload');
      setError(errorObj);

      // Only show error toast if we haven't already shown one
      if (
        !err?.message?.includes('Permission Error') &&
        !err?.message?.includes('File Too Large') &&
        !err?.message?.includes('Invalid File Type')
      ) {
        toast.error('Upload failed', {
          description: err instanceof Error ? err.message : 'Unknown error',
        });
      }
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    error,
    uploadedUrl,
  };
};
