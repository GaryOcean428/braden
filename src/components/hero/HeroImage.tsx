
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeroImageProps {
  src?: string;
  alt?: string;
  className?: string;
  onError?: (error: Error) => void;
}

// Create a StorageBucketName type to use
export type StorageBucketName = 'content_images' | 'avatars' | 'hero_images';

const HeroImage: React.FC<HeroImageProps> = ({ 
  src = '/hero-image.jpg',  // Default to static hero image
  alt = 'Braden Group Hero Image',
  className = '',
  onError
}) => {
  // Helper function to get a public URL
  const getPublicUrl = (bucketName: StorageBucketName, path: string): string => {
    try {
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(path);
      
      return data.publicUrl;
    } catch (error) {
      console.info("Error loading hero image, falling back to default");
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
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default HeroImage;
