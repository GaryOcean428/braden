
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

        // Try to fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('media')
            .select('file_path')
            .eq('title', 'hero-image')
            .maybeSingle();

          if (error) {
            // If there's a Supabase error, log it but continue with default image
            console.log('Supabase error, using default image:', error);
            setIsLoading(false);
            return;
          }

          // If no custom hero image is set, use default and finish loading
          if (!data?.file_path) {
            setIsLoading(false);
            return;
          }

          // If we have a file path, try to get the public URL
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
            console.error('Error loading image from storage');
            setIsLoading(false);
          };
          img.src = publicUrl;
        } catch (supabaseError) {
          // If there's any error in the Supabase process, use default image
          console.error('Error with Supabase operations:', supabaseError);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in loadHeroImage function:', error);
        setImageError(true);
        setIsLoading(false);
        onError(error instanceof Error ? error : new Error('Failed to load hero image'));
      }
    };

    loadHeroImage();

    // Set a safety timeout to ensure loading state doesn't persist indefinitely
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.log('Safety timeout triggered to prevent infinite loading');
      }
    }, 3000);

    return () => clearTimeout(safetyTimeout);
  }, [onError]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    onError(new Error('Failed to load hero image'));
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center" aria-busy="true">
        <Skeleton className="w-full h-full absolute inset-0" />
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
    <div className="w-full h-full">
      <img
        src={heroImage}
        alt="Braden Group Apprentices"
        className="w-full h-full object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};
