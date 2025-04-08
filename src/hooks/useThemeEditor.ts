
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ThemeSettings, ColorSet } from '@/context/ThemeContext';
import { useTheme } from '@/context/ThemeContext';

export const useThemeEditor = () => {
  const { theme: currentTheme, applyTheme } = useTheme();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(currentTheme);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadThemeSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('*')
        .eq('type', 'theme')
        .single() as any;
      
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          console.error("Error loading theme settings:", error);
          toast.error("Failed to load theme settings");
        }
        return;
      }
      
      if (data?.settings) {
        setThemeSettings(data.settings);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load theme settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveThemeSettings = useCallback(async () => {
    if (!themeSettings) return;
    
    try {
      setIsSaving(true);
      
      const { data, error: fetchError } = await supabase
        .from('site_settings' as any)
        .select('id')
        .eq('type', 'theme')
        .single() as any;
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (data?.id) {
        // Update existing settings
        const { error } = await supabase
          .from('site_settings' as any)
          .update({
            settings: themeSettings,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id) as any;
          
        if (error) throw error;
      } else {
        // Create new settings
        const { error } = await supabase
          .from('site_settings' as any)
          .insert({
            type: 'theme',
            settings: themeSettings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }) as any;
          
        if (error) throw error;
      }
      
      // Apply the saved theme to the site
      applyTheme(themeSettings);
      
      toast.success("Theme settings saved successfully");
    } catch (error) {
      console.error("Error saving theme settings:", error);
      toast.error("Failed to save theme settings");
    } finally {
      setIsSaving(false);
    }
  }, [themeSettings, applyTheme]);

  const handleColorChange = useCallback((
    category: 'primary' | 'secondary' | 'extended',
    index: number,
    field: keyof ColorSet,
    value: string
  ) => {
    if (!themeSettings) return;
    
    setThemeSettings(prev => {
      if (!prev) return prev;
      
      const newSettings = { ...prev };
      newSettings.colors[category][index][field] = value;
      return newSettings;
    });
  }, [themeSettings]);

  const handleTypographyChange = useCallback((field: keyof ThemeSettings['typography'], value: string) => {
    if (!themeSettings) return;
    
    setThemeSettings(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        typography: {
          ...prev.typography,
          [field]: value
        }
      };
    });
  }, [themeSettings]);

  const handleSpacingChange = useCallback((field: keyof ThemeSettings['spacing'], value: string) => {
    if (!themeSettings) return;
    
    setThemeSettings(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        spacing: {
          ...prev.spacing,
          [field]: value
        }
      };
    });
  }, [themeSettings]);
  
  return {
    themeSettings,
    setThemeSettings,
    isLoading,
    isSaving,
    loadThemeSettings,
    saveThemeSettings,
    handleColorChange,
    handleTypographyChange,
    handleSpacingChange
  };
};
