
import { useState } from 'react';
import { STORAGE_BUCKETS } from '@/integrations/supabase/client';
import { useUploadFile } from './storage/useUploadFile';
import { useDeleteFile } from './storage/useDeleteFile';
import { useListFiles } from './storage/useListFiles';

export const useImageUpload = (bucketName = STORAGE_BUCKETS.CONTENT_IMAGES) => {
  const { uploadFile, uploading, error: uploadError, uploadedUrl } = useUploadFile(bucketName);
  const { deleteFile, error: deleteError } = useDeleteFile(bucketName);
  const { listFiles, loading, error: listError } = useListFiles(bucketName);
  
  const [error, setError] = useState<Error | null>(null);
  
  // Consolidate errors
  if (uploadError) setError(uploadError);
  if (deleteError) setError(deleteError);
  if (listError) setError(listError);
  
  return {
    uploadImage: uploadFile,
    deleteImage: deleteFile,
    listImages: listFiles,
    uploading,
    error,
    uploadedUrl
  };
};
