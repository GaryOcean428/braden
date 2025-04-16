
import { useState, useCallback } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { STORAGE_BUCKETS, StorageBucketName } from '@/integrations/supabase/storage';

interface UseImageManagerProps {
  bucketName: StorageBucketName;
  onImageSelect?: (url: string) => void;
}

export const useImageManager = ({ bucketName, onImageSelect }: UseImageManagerProps) => {
  const { uploadImage, deleteImage, listImages, uploading } = useImageUpload(bucketName);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setError(null);
    
    try {
      const url = await uploadImage(file);
      
      if (url) {
        setRefreshKey(prev => prev + 1);
        setSelectedImage(url);
        
        if (onImageSelect) {
          onImageSelect(url);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      console.error("Upload error:", err);
    }
    
    e.target.value = '';
  }, [uploadImage, onImageSelect]);

  const handleImageSelect = useCallback((url: string) => {
    setSelectedImage(url);
    if (onImageSelect) {
      onImageSelect(url);
    }
  }, [onImageSelect]);

  const handleDeleteImage = useCallback(async (name: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this image?');
    if (!confirmed) return;

    setError(null);
    try {
      const success = await deleteImage(name);
      if (success) {
        setRefreshKey(prev => prev + 1);
        
        if (selectedImage && name === selectedImage) {
          setSelectedImage(null);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
      setError(errorMessage);
      console.error("Delete error:", err);
    }
  }, [deleteImage, selectedImage]);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return {
    selectedImage,
    loading,
    error,
    uploading,
    currentPage,
    refreshKey,
    handleFileChange,
    handleImageSelect,
    handleDeleteImage,
    handleRefresh,
    handlePageChange,
  };
};
