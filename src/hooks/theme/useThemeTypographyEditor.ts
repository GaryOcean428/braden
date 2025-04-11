
import { useCallback } from 'react';
import { ThemeSettings } from '@/context/theme';

export const useThemeTypographyEditor = (
  themeSettings: ThemeSettings | null,
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings | null>>
) => {
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
  }, [themeSettings, setThemeSettings]);

  return { handleTypographyChange };
};
