import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { MediaItem } from './types';
import { MediaItem as MediaItemComponent } from './MediaItem';
import { toast } from 'sonner';

interface MediaGalleryProps {
  loading: boolean;
  images: MediaItem[];
  onDeleteImage: (id: string, filePath: string) => Promise<void>;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  loading,
  images,
  onDeleteImage,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse rounded-lg h-48"
            ></div>
          ))}
      </div>
    );
  }

  if (images.length === 0 && !loading) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-[#95a5a6]">
          No images found. Upload some images to get started.
        </p>
      </div>
    );
  }

  const handleDeleteImage = async (id: string, filePath: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this image?'
    );
    if (!confirmed) return;

    try {
      await onDeleteImage(id, filePath);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <MediaItemComponent
          key={image.id}
          image={image}
          onDeleteImage={handleDeleteImage}
        />
      ))}
    </div>
  );
};
