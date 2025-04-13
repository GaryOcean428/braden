import { useState, useEffect } from 'react';
import { supabase, STORAGE_BUCKETS } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from 'lucide-react';

interface HeroImageProps {
  onError?: (error: Error) => void;
}

export const HeroImage = ({ onError = () => {} }: HeroImageProps) => {
  const [heroImage, setHeroImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Create a fallback gradient background with Braden colors
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAwIDYwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzJjM2U1MCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4MTFhMmMiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmFkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQycHgiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+QnJhZGVuIEdyb3VwPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlBlb3BsZS4gRW1wbG95bWVudC4gUHJvZ3Jlc3MuPC90ZXh0Pjwvc3ZnPg==';

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        setIsLoading(true);
        setImageError(false);
        
        // Set the new uploaded image as the primary hero image
        const newHeroImage = '/lovable-uploads/a37e9f48-2fcd-4c98-bab5-8d60a6e41f27.png';
        setHeroImage(newHeroImage);
        
        // Also try to load images from Supabase as a fallback
        try {
          const { data: files, error: listError } = await supabase.storage
            .from(STORAGE_BUCKETS.HERO_IMAGES)
            .list();
            
          if (listError) {
            console.log('Could not list hero images from Supabase:', listError);
            // We'll continue with the uploaded image
          } else if (files && files.length > 0) {
            // Keep as backup if the primary image fails
            const { data } = supabase.storage
              .from(STORAGE_BUCKETS.HERO_IMAGES)
              .getPublicUrl(files[0].name);
              
            // We already have our primary image set, this is just backup
            console.log('Found Supabase hero image as backup:', data?.publicUrl);
          }
        } catch (supabaseError) {
          console.error('Error with Supabase operations:', supabaseError);
          // We already have the uploaded image set
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in loadHeroImage function:', error);
        setImageError(true);
        setIsLoading(false);
        onError(error instanceof Error ? error : new Error('Failed to load hero image'));
      }
    };
    
    loadHeroImage();
    
    // Safety timeout to avoid infinite loading state
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.log('Safety timeout triggered to prevent infinite loading');
      }
    }, 3000);
    
    return () => clearTimeout(safetyTimeout);
  }, [onError]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-braden-navy to-braden-dark-red flex items-center justify-center" aria-busy="true">
        <Skeleton className="w-full h-full absolute inset-0" />
      </div>
    );
  }

  if (imageError) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-braden-navy to-braden-dark-red flex items-center justify-center" aria-busy="false">
        <Loader className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <img
        src={heroImage}
        alt="Braden Group - People. Employment. Progress."
        className="w-full h-full object-cover"
        onError={() => {
          console.log('Error loading hero image, falling back to default');
          setHeroImage(fallbackImage);
        }}
      />
    </div>
  );
};
