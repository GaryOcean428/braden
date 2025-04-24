
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageGrid } from '../ImageGrid';

interface GalleryTabProps {
  images: Array<{ name: string; publicUrl: string }>;
  selectedImage: string | null;
  loading: boolean;
  error: Error | string | null;
  currentPage: number;
  totalPages: number;
  onImageSelect: (url: string) => void;
  onDeleteImage: (name: string) => Promise<void>;
  onPageChange: (page: number) => void;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({
  images,
  selectedImage,
  loading,
  error,
  currentPage,
  totalPages,
  onImageSelect,
  onDeleteImage,
  onPageChange
}) => {
  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div 
                key={image.name} 
                className={`relative aspect-square rounded-md border overflow-hidden cursor-pointer ${selectedImage === image.publicUrl ? 'ring-2 ring-primary' : ''}`}
                onClick={() => onImageSelect(image.publicUrl)}
              >
                <img 
                  src={image.publicUrl} 
                  alt={image.name} 
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage(image.name);
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm">
                  {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          {loading ? (
            <p>Loading images...</p>
          ) : error ? (
            <p className="text-[#ab233a]">
              Error: {error instanceof Error ? error.message : error}
            </p>
          ) : (
            <p>No images found. Upload some images to get started.</p>
          )}
        </div>
      )}
    </div>
  );
};
