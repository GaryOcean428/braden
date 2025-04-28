
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MediaItem } from '../types';

export const useLogoManager = (
  onLogoUpdate?: (logoUrl: string) => void,
  currentLogo?: string
) => {
  const [selectedLogo, setSelectedLogo] = useState<MediaItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(currentLogo);
  
  useEffect(() => {
    const loadCurrentLogo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          setError('Authentication required to manage branding');
          return;
        }
        
        setLogoUrl(currentLogo);
      } catch (err: any) {
        console.error('Error loading current logo:', err);
        setError('Failed to load current branding settings');
      } finally {
        setLoading(false);
      }
    };
    
    loadCurrentLogo();
  }, [currentLogo]);

  const handleUpdateLogo = async () => {
    if (!selectedLogo) return;
    
    try {
      setIsUpdating(true);
      setError(null);
      
      if (onLogoUpdate) {
        onLogoUpdate(selectedLogo.publicUrl);
        setLogoUrl(selectedLogo.publicUrl);
      }
      
      toast.success('Logo updated successfully!');
    } catch (err: any) {
      console.error('Error updating logo:', err);
      setError(`Failed to update logo: ${err.message}`);
      toast.error('Failed to update logo');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    selectedLogo,
    setSelectedLogo,
    isUpdating,
    error,
    setError, // Added setError to the return object
    loading,
    logoUrl,
    handleUpdateLogo
  };
};
