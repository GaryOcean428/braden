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

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        setIsLoading(true);
        setImageError(false);
        
        // Use a data URI for a fallback gradient background
        const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAwIDYwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzJjM2U1MCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4MTFhMmMiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmFkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQycHgiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+QnJhZGVuIEdyb3VwPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlNoYXBpbmcgVG9tb3Jyb3cncyBXb3JrZm9yY2UgVG9kYXk8L3RleHQ+PC9zdmc+';
        
        // Set the fallback image immediately
        setHeroImage(fallbackImage);
        
        // Try to fetch from Supabase hero-images bucket
        try {
          // First check if we have any images in the hero-images bucket
          const { data: files, error: listError } = await supabase.storage
            .from(STORAGE_BUCKETS.HERO_IMAGES)
            .list();
            
          if (listError) {
            console.log('Error listing hero images:', listError);
            setIsLoading(false);
            return;
          }
          
          // If we have any hero images, use the first one
          if (files && files.length > 0) {
            const { data: { publicUrl } } = supabase.storage
              .from(STORAGE_BUCKETS.HERO_IMAGES)
              .getPublicUrl(files[0].name);
              
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
            return;
          }
          
          // If no images in hero-images bucket, try the media table as fallback
          const { data, error } = await supabase
            .from('media')
            .select('file_path')
            .eq('title', 'hero-image')
            .maybeSingle();
            
          if (error) {
            console.log('Supabase media query error:', error);
            setIsLoading(false);
            return;
          }
          
          // If no custom hero image is set, use fallback and finish loading
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
          // If there's any error in the Supabase process, use fallback image
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
    // Use data URI fallback if image loading fails
    const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAwIDYwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzJjM2U1MCIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4MTFhMmMiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmFkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQycHgiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+QnJhZGVuIEdyb3VwPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlNoYXBpbmcgVG9tb3Jyb3cncyBXb3JrZm9yY2UgVG9kYXk8L3RleHQ+PC9zdmc+';
    setHeroImage(fallbackImage);
    setIsLoading(false);
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
