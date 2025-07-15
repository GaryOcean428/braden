import { useCallback } from 'react';
import { ColorSet, ThemeSettings } from '@/context/theme';

export const useThemeColorEditor = (
  themeSettings: ThemeSettings | null,
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings | null>>
) => {
  const handleColorChange = useCallback(
    (
      category: 'primary' | 'secondary' | 'extended',
      index: number,
      field: keyof ColorSet,
      value: string
    ) => {
      if (!themeSettings) return;

      setThemeSettings((prev) => {
        if (!prev) return prev;

        const newSettings = { ...prev };
        newSettings.colors[category][index][field] = value;
        return newSettings;
      });
    },
    [themeSettings, setThemeSettings]
  );

  return { handleColorChange };
};
