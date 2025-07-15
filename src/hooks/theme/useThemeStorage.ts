import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ThemeSettings, useTheme } from '@/context/theme';

export const useThemeStorage = () => {
  const { theme: currentTheme, applyTheme } = useTheme();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(
    currentTheme
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadThemeSettings = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('type', 'theme')
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          // Not found error
          console.error('Error loading theme settings:', error);
          toast.error('Failed to load theme settings');
        }
        // If no settings found, use the current theme from context
        setThemeSettings(currentTheme);
        return;
      }

      if (data?.settings) {
        setThemeSettings(data.settings as ThemeSettings);
      } else {
        setThemeSettings(currentTheme);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load theme settings');
      setThemeSettings(currentTheme); // Fallback to current theme
    } finally {
      setIsLoading(false);
    }
  }, [currentTheme]);

  const saveThemeSettings = useCallback(async () => {
    if (!themeSettings) return;

    try {
      setIsSaving(true);

      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('id')
        .eq('type', 'theme')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data?.id) {
        // Update existing settings
        const { error } = await supabase
          .from('site_settings')
          .update({
            settings: themeSettings,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.id);

        if (error) throw error;
      } else {
        // Create new settings
        const { error } = await supabase.from('site_settings').insert({
          type: 'theme',
          settings: themeSettings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;
      }

      // Apply the saved theme to the site
      applyTheme(themeSettings);

      toast.success('Theme settings saved successfully');
    } catch (error) {
      console.error('Error saving theme settings:', error);
      toast.error('Failed to save theme settings');
    } finally {
      setIsSaving(false);
    }
  }, [themeSettings, applyTheme]);

  return {
    themeSettings,
    setThemeSettings,
    isLoading,
    isSaving,
    loadThemeSettings,
    saveThemeSettings,
  };
};
