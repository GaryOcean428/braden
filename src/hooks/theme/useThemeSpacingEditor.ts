
import { useCallback } from 'react';
import { ThemeSettings } from '@/context/theme';

export const useThemeSpacingEditor = (
  themeSettings: ThemeSettings | null,
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings | null>>
) => {
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
  }, [themeSettings, setThemeSettings]);

  return { handleSpacingChange };
};
