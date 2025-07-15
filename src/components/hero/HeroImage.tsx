import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeroImageProps {
  src?: string;
  alt?: string;
  className?: string;
  onError?: (error: Error) => void;
}

export type StorageBucketName = 'content_images' | 'avatars' | 'hero_images';

const HeroImage: React.FC<HeroImageProps> = ({
  src = 'https://lh3.googleusercontent.com/gps-cs-s/AB5caB_4-M4Ztd7dnkISNbA9YI26OrkyCqv3kce_4tVhCDHOtO43YLbyhEqva1ipphv3ImbIijtOkIfjkqYSzAAZNUQGAX1XYt4TRBpwyb7sLa4H-iQhAoUV-rATbTbNKFxphZA7pbtH=w540-h312-n-k-no',
  alt = 'Braden Group Hero Image',
  className = '',
  onError,
}) => {
  // Helper function to get a public URL
  const getPublicUrl = (
    bucketName: StorageBucketName,
    path: string
  ): string => {
    try {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.info('Error loading hero image, falling back to default');
      if (onError && error instanceof Error) {
        onError(error);
      }
      return src;
    }
  };

  // Check if the src is a Supabase storage path
  const isSupabasePath = src.startsWith('storage/');

  // If it's a Supabase path, transform it to a public URL
  const imageSrc = isSupabasePath
    ? getPublicUrl('hero_images', src.replace('storage/', ''))
    : src;

  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <img src={imageSrc} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default HeroImage;
