
import { useState, useCallback } from 'react';
import { STORAGE_BUCKETS, StorageBucketName } from '@/integrations/supabase/storage';
import { useUploadFile } from './storage/useUploadFile';
import { useDeleteFile } from './storage/useDeleteFile';
import { useListFiles } from './storage/useListFiles';

export const useImageUpload = (bucketName: StorageBucketName = STORAGE_BUCKETS.CONTENT_IMAGES) => {
  const { uploadFile, uploading, error: uploadError, uploadedUrl } = useUploadFile(bucketName);
  const { deleteFile, error: deleteError } = useDeleteFile(bucketName);
  const { listFiles, loading, error: listError } = useListFiles(bucketName);
  
  const [error, setError] = useState<Error | null>(null);
  
  // Create memoized versions of functions to prevent infinite renders
  const uploadImage = useCallback(async (file: File) => {
    try {
      setError(null);
      return await uploadFile(file);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Upload failed'));
      throw err;
    }
  }, [uploadFile]);
  
  const deleteImage = useCallback(async (name: string) => {
    try {
      setError(null);
      return await deleteFile(name);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Delete failed'));
      throw err;
    }
  }, [deleteFile]);
  
  const listImages = useCallback(async () => {
    try {
      setError(null);
      return await listFiles();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to list images'));
      throw err;
    }
  }, [listFiles]);
  
  // Check for errors from the hooks
  if (uploadError) setError(uploadError);
  if (deleteError) setError(deleteError);
  if (listError) setError(listError);
  
  return {
    uploadImage,
    deleteImage,
    listImages,
    uploading,
    error,
    uploadedUrl
  };
};
