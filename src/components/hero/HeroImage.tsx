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
        
        // Set the fallback image immediately to ensure we always have something to show
        setHeroImage(fallbackImage);
        
        try {
          // Try to load an image from the public folder as a reliable fallback
          const publicImagePath = '/hero-image.jpg';
          
          // Create an image element to test if the public image is available
          const publicImg = new Image();
          publicImg.onload = () => {
            setHeroImage(publicImagePath);
            setIsLoading(false);
          };
          
          // Start loading the public image
          publicImg.src = publicImagePath;
          
          // We still attempt to fetch from Supabase if possible
          const { data: files, error: listError } = await supabase.storage
            .from(STORAGE_BUCKETS.HERO_IMAGES)
            .list();
            
          if (listError) {
            console.log('Could not list hero images from Supabase:', listError);
            // We'll continue with the public image or fallback
          } else if (files && files.length > 0) {
            const { data } = supabase.storage
              .from(STORAGE_BUCKETS.HERO_IMAGES)
              .getPublicUrl(files[0].name);
              
            if (data?.publicUrl) {
              // Preload the Supabase image
              const img = new Image();
              img.onload = () => {
                setHeroImage(data.publicUrl);
                setIsLoading(false);
              };
              img.onerror = () => {
                // Keep using the public image or fallback
                console.log('Could not load image from Supabase');
              };
              img.src = data.publicUrl;
            }
          }
        } catch (supabaseError) {
          console.error('Error with Supabase operations:', supabaseError);
          // We already have the fallback image set
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
    
    // Safety timeout to avoid infinite loading state
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.log('Safety timeout triggered to prevent infinite loading');
      }
    }, 3000);
    
    return () => clearTimeout(safetyTimeout);
  }, [onError, fallbackImage]);

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
          // If image fails to load, ensure we're using the fallback
          setHeroImage(fallbackImage);
        }}
      />
    </div>
  );
};
