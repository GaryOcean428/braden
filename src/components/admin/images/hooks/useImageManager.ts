import { useState, useCallback, useEffect, useRef } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  STORAGE_BUCKETS,
  StorageBucketName,
} from '@/integrations/supabase/storage';

interface UseImageManagerProps {
  bucketName: StorageBucketName;
  onImageSelect?: (url: string) => void;
}

export const useImageManager = ({
  bucketName,
  onImageSelect,
}: UseImageManagerProps) => {
  const { uploadImage, deleteImage, listImages, uploading } =
    useImageUpload(bucketName);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<Error | string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState<
    Array<{ name: string; publicUrl: string }>
  >([]);

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);

  // Fetch images when the component mounts or refreshKey changes
  useEffect(() => {
    const fetchImages = async () => {
      if (!isMounted.current) return;

      setLoading(true);
      setError(null);

      try {
        const imagesList = await listImages();

        if (isMounted.current) {
          setImages(imagesList || []);
        }
      } catch (err) {
        if (isMounted.current) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to load images';
          setError(err instanceof Error ? err : errorMessage);
          console.error('List error:', err);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchImages();

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [listImages, refreshKey, bucketName]);

  // Reset isMounted on mount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      setError(null);

      try {
        const url = await uploadImage(file);

        if (url && isMounted.current) {
          setRefreshKey((prev) => prev + 1);
          setSelectedImage(url);

          if (onImageSelect) {
            onImageSelect(url);
          }
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err : String(err));
          console.error('Upload error:', err);
        }
      }

      // Reset input value
      if (e.target) {
        e.target.value = '';
      }
    },
    [uploadImage, onImageSelect]
  );

  const handleImageSelect = useCallback(
    (url: string) => {
      setSelectedImage(url);
      if (onImageSelect) {
        onImageSelect(url);
      }
    },
    [onImageSelect]
  );

  const handleDeleteImage = useCallback(
    async (name: string) => {
      const confirmed = window.confirm(
        'Are you sure you want to delete this image?'
      );
      if (!confirmed) return;

      setError(null);
      try {
        const success = await deleteImage(name);
        if (success && isMounted.current) {
          setRefreshKey((prev) => prev + 1);

          if (selectedImage && selectedImage.includes(name)) {
            setSelectedImage(null);
          }
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err : String(err));
          console.error('Delete error:', err);
        }
      }
    },
    [deleteImage, selectedImage]
  );

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

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
  };
};
