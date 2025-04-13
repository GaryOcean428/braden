
import React, { useState, useEffect, useCallback } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { STORAGE_BUCKETS } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Loader2 } from 'lucide-react';
import { ImageUploader } from './images/ImageUploader';
import { ImageGallery } from './images/ImageGallery';

interface ImageManagerProps {
  bucketName?: string;
  onImageSelect?: (url: string) => void;
  title?: string;
  allowMultiple?: boolean;
}

export const ImageManager: React.FC<ImageManagerProps> = ({
  bucketName = STORAGE_BUCKETS.CONTENT_IMAGES,
  onImageSelect,
  title = 'Image Manager',
  allowMultiple = false,
}) => {
  const { uploadImage, deleteImage, listImages, uploading } = useImageUpload(bucketName);
  const [images, setImages] = useState<Array<{ name: string; publicUrl: string }>>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load images when component mounts or refreshKey changes
  useEffect(() => {
    let isMounted = true;
    
    const loadImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const imagesList = await listImages();
        
        if (isMounted) {
          setImages(imagesList);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load images");
          console.error("Error loading images:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadImages();
    
    return () => {
      isMounted = false;
    };
  }, [refreshKey, listImages]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
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
      setError("Failed to upload image");
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

    try {
      const success = await deleteImage(name);
      if (success) {
        setRefreshKey(prev => prev + 1);
        
        if (selectedImage && images.find(img => img.publicUrl === selectedImage)?.name === name) {
          setSelectedImage(null);
        }
      }
    } catch (err) {
      setError("Failed to delete image");
      console.error("Delete error:", err);
    }
  }, [deleteImage, selectedImage, images]);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <ImageUploader 
              uploading={uploading}
              error={error}
              onFileChange={handleFileChange}
            />
          </TabsContent>
          
          <TabsContent value="gallery">
            <ImageGallery 
              images={images}
              selectedImage={selectedImage}
              loading={loading}
              error={error}
              onImageSelect={handleImageSelect}
              onDeleteImage={handleDeleteImage}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
