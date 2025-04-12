
import React, { useState, useEffect, useCallback } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { STORAGE_BUCKETS } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, Trash2, RefreshCw } from 'lucide-react';

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
        
        // Only update state if the component is still mounted
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
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [refreshKey, listImages]); // Add listImages as a dependency

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const url = await uploadImage(file);
      
      if (url) {
        // Refresh the image list
        setRefreshKey(prev => prev + 1);
        
        // Select the newly uploaded image
        setSelectedImage(url);
        
        // Call the onImageSelect callback if provided
        if (onImageSelect) {
          onImageSelect(url);
        }
      }
    } catch (err) {
      setError("Failed to upload image");
      console.error("Upload error:", err);
    }
    
    // Reset the input
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
        // Refresh the image list
        setRefreshKey(prev => prev + 1);
        
        // Clear selection if the deleted image was selected
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
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop an image, or click to select
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="max-w-xs"
              />
              {uploading && (
                <div className="mt-4 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Uploading...</span>
                </div>
              )}
              {error && (
                <p className="mt-4 text-sm text-red-500">
                  Error: {error}
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <p className="text-center py-8 text-red-500">
                {error}
              </p>
            ) : images.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No images found. Upload some images to get started.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div 
                    key={image.name}
                    className={`relative group rounded-lg overflow-hidden border ${
                      selectedImage === image.publicUrl ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img 
                      src={image.publicUrl} 
                      alt={image.name}
                      className="w-full h-32 object-cover cursor-pointer"
                      onClick={() => handleImageSelect(image.publicUrl)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteImage(image.name)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
