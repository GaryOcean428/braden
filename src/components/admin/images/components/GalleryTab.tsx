import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2, ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GalleryTabProps {
  images: Array<{ name: string; publicUrl: string }>;
  selectedImage: string | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onImageSelect: (url: string) => void;
  onDeleteImage: (name: string) => void;
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
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-[#ab233a]" />
        <span className="ml-2">Loading images...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          Error loading images: {error}
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No images found</p>
        <p className="text-sm text-gray-400">
          Upload some images using the Upload tab
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={`${image.name}-${index}`}
            className={`
              relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
              ${
                selectedImage === image.publicUrl
                  ? 'border-[#ab233a] ring-2 ring-[#ab233a]/20'
                  : 'border-gray-200 hover:border-[#cbb26a]'
              }
            `}
            onClick={() => onImageSelect(image.publicUrl)}
          >
            <div className="aspect-square">
              <img
                src={image.publicUrl}
                alt={image.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load image:', image.publicUrl);
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEwMCAxMDBaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUNBNEFGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPgo=';
                }}
                onLoad={() => {
                  console.log('Successfully loaded image:', image.publicUrl);
                }}
              />
            </div>

            {/* Overlay with image info and delete button */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-end">
              <div className="w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-center">
                  <span className="text-white text-xs truncate">
                    {image.name}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete ${image.name}?`)) {
                        onDeleteImage(image.name);
                      }
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <span className="flex items-center px-3 text-sm">
            Page {currentPage} of {totalPages}
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
      )}
    </div>
  );
};
