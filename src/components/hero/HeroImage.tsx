
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from 'lucide-react';

interface HeroImageProps {
  onError: (error: Error) => void;
}

export const HeroImage = ({ onError }: HeroImageProps) => {
  const [heroImage, setHeroImage] = useState("/hero-image.jpg");
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        setIsLoading(true);
        setImageError(false);

        const { data, error } = await supabase
          .from('media')
          .select('file_path')
          .eq('title', 'hero-image')
          .maybeSingle();

        if (error) {
          throw error;
        }

        // If no custom hero image is set, use default and finish loading
        if (!data?.file_path) {
          setIsLoading(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(data.file_path);

        // Preload the image
        const img = new Image();
        img.onload = () => {
          setHeroImage(publicUrl);
          setIsLoading(false);
        };
        img.onerror = () => {
          console.error('Error loading image');
          setImageError(true);
          setIsLoading(false);
          onError(new Error('Failed to load hero image'));
        };
        img.src = publicUrl;

      } catch (error) {
        console.error('Error loading hero image:', error);
        setImageError(true);
        setIsLoading(false);
        onError(error instanceof Error ? error : new Error('Failed to load hero image'));
      }
    };

    loadHeroImage();
  }, [onError]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center" aria-busy="true">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (imageError) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center" aria-busy="false">
        <Loader className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={heroImage}
      alt="Braden Group Apprentices"
      className="w-full h-full object-cover"
      onError={() => {
        setImageError(true);
        onError(new Error('Failed to load hero image'));
      }}
    />
  );
};
