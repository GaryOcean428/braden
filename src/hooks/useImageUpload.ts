import { useState, useCallback, useEffect } from 'react';
import {
  STORAGE_BUCKETS,
  StorageBucketName,
} from '@/integrations/supabase/storage';
import { useUploadFile } from './storage/useUploadFile';
import { useDeleteFile } from './storage/useDeleteFile';
import { useListFiles } from './storage/useListFiles';

export const useImageUpload = (
  bucketName: StorageBucketName = STORAGE_BUCKETS.CONTENT_IMAGES
) => {
  const {
    uploadFile,
    uploading,
    error: uploadError,
    uploadedUrl,
  } = useUploadFile(bucketName);
  const { deleteFile, error: deleteError } = useDeleteFile(bucketName);
  const { listFiles, loading, error: listError } = useListFiles(bucketName);

  const [error, setError] = useState<Error | null>(null);

  // Handle error state updates in useEffect to prevent infinite loops
  useEffect(() => {
    if (uploadError) setError(uploadError);
    else if (deleteError) setError(deleteError);
    else if (listError) setError(listError);
    else setError(null);
  }, [uploadError, deleteError, listError]);

  // Create memoized versions of functions to prevent infinite renders
  const uploadImage = useCallback(
    async (file: File) => {
      try {
        setError(null);
        return await uploadFile(file);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed');
        console.error('Upload error in useImageUpload:', error);
        return null;
      }
    },
    [uploadFile]
  );

  const deleteImage = useCallback(
    async (name: string) => {
      try {
        setError(null);
        return await deleteFile(name);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Delete failed');
        console.error('Delete error in useImageUpload:', error);
        return false;
      }
    },
    [deleteFile]
  );

  const listImages = useCallback(async () => {
    try {
      setError(null);
      return await listFiles();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to list images');
      console.error('List error in useImageUpload:', error);
      return [];
    }
  }, [listFiles]);

  return {
    uploadImage,
    deleteImage,
    listImages,
    uploading,
    error,
    uploadedUrl,
  };
};
