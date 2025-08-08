import { supabase } from '@/integrations/supabase/client';

export const useHeroImagesList = () => {
  const listHeroImages = async () => {
    const { data, error } = await supabase
      .storage
      .from('hero-images')
      .list('');
    
    if (error) {
      console.error('Error listing hero images:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  };

  return { listHeroImages };
};