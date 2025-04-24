
import { useState, useCallback, useEffect } from 'react';
import { STORAGE_BUCKETS, StorageBucketName } from '@/integrations/supabase/storage';
import { useUploadFile } from './storage/useUploadFile';
import { useDeleteFile } from './storage/useDeleteFile';
import { useListFiles } from './storage/useListFiles';

export const useImageUpload = (bucketName: StorageBucketName = STORAGE_BUCKETS.CONTENT_IMAGES) => {
  const { uploadFile, uploading, error: uploadError, uploadedUrl } = useUploadFile(bucketName);
  const { deleteFile, error: deleteError } = useDeleteFile(bucketName);
  const { listFiles, loading, error: listError } = useListFiles(bucketName);
  
  const [error, setError] = useState<Error | null>(null);
  
  // Handle error state updates in useEffect to prevent infinite loops
  useEffect(() => {
    if (uploadError) setError(uploadError);
    if (deleteError) setError(deleteError);
    if (listError) setError(listError);
  }, [uploadError, deleteError, listError]);
  
  // Create memoized versions of functions to prevent infinite renders
  const uploadImage = useCallback(async (file: File) => {
    try {
      setError(null);
      return await uploadFile(file);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error);
      throw error;
    }
  }, [uploadFile]);
  
  const deleteImage = useCallback(async (name: string) => {
    try {
      setError(null);
      return await deleteFile(name);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Delete failed');
      setError(error);
      throw error;
    }
  }, [deleteFile]);
  
  const listImages = useCallback(async () => {
    try {
      setError(null);
      return await listFiles();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to list images');
      setError(error);
      throw error;
    }
  }, [listFiles]);
  
  return {
    uploadImage,
    deleteImage,
    listImages,
    uploading,
    error,
    uploadedUrl
  };
};
