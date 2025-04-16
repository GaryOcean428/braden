import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ImageGalleryProps {
  images: Array<{ name: string; publicUrl: string }>;
  selectedImage: string | null;
  loading: boolean;
  error: string | null;
  onImageSelect: (url: string) => void;
  onDeleteImage: (name: string) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  selectedImage,
  loading,
  error,
  onImageSelect,
  onDeleteImage
}) => {
  return (
    <ErrorBoundary>
      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      
      {error && (
        <p className="text-center py-8 text-red-500">
          {error}
        </p>
      )}
      
      {images.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          No images found. Upload some images to get started.
        </p>
      )}
      
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
              onClick={() => onImageSelect(image.publicUrl)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDeleteImage(image.name)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
};
