
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Loader2 } from 'lucide-react';
import { ImageUploader } from './images/ImageUploader';
import { GalleryTab } from './images/components/GalleryTab';
import { ErrorAlert } from './ErrorAlert';
import { useImageManager } from './images/hooks/useImageManager';
import { STORAGE_BUCKETS, StorageBucketName } from '@/integrations/supabase/storage';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ImageManagerProps {
  bucketName?: StorageBucketName;
  onImageSelect?: (url: string) => void;
  title?: string;
  allowMultiple?: boolean;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  bucketName = STORAGE_BUCKETS.CONTENT_IMAGES,
  onImageSelect,
  title = 'Image Manager',
  allowMultiple = false,
}) => {
  const {
    images,
    selectedImage,
    loading,
    error,
    uploading,
    currentPage,
    handleFileChange,
    handleImageSelect,
    handleDeleteImage,
    handleRefresh,
    handlePageChange,
  } = useImageManager({ bucketName, onImageSelect });

  // Calculate pagination values
  const totalPages = Math.ceil((images?.length || 0) / 12);
  const startIndex = (currentPage - 1) * 12;
  const endIndex = startIndex + 12;
  const paginatedImages = useMemo(() => images?.slice(startIndex, endIndex) || [], [images, startIndex, endIndex]);

  // Convert error to string for ErrorAlert component
  const errorString = error ? (error instanceof Error ? error.message : String(error)) : null;
  // Convert string error to Error object if needed for ImageUploader
  const errorObject = error ? (error instanceof Error ? error : new Error(String(error))) : null;

  return (
    <ErrorBoundary>
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
          {errorString && <ErrorAlert error={errorString} />}
          
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <ImageUploader 
                uploading={uploading}
                error={errorObject}
                onFileChange={handleFileChange}
              />
            </TabsContent>
            
            <TabsContent value="gallery">
              <GalleryTab 
                images={paginatedImages}
                selectedImage={selectedImage}
                loading={loading}
                error={errorString}
                currentPage={currentPage}
                totalPages={totalPages}
                onImageSelect={handleImageSelect}
                onDeleteImage={handleDeleteImage}
                onPageChange={handlePageChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default React.memo(ImageManager);
