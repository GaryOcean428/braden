import { useState, useCallback, useEffect, useMemo } from 'react';
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
  const [images, setImages] = useState<Array<{ name: string; publicUrl: string }>>([]);

  // Fetch images when the component mounts or refreshKey changes
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const imagesList = await listImages();
        setImages(imagesList);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load images';
        setError(errorMessage);
        console.error("List error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, [listImages, refreshKey, bucketName]);

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
        
        if (selectedImage && selectedImage.includes(name)) {
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

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const paginatedImages = useMemo(() => {
    const ITEMS_PER_PAGE = 12;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return images.slice(startIndex, endIndex);
  }, [images, currentPage]);

  return {
    images,
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
    paginatedImages,
  };
};
