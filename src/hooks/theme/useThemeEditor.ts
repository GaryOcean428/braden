import { useEffect } from 'react';
import { useThemeStorage } from './useThemeStorage';
import { useThemeColorEditor } from './useThemeColorEditor';
import { useThemeTypographyEditor } from './useThemeTypographyEditor';
import { useThemeSpacingEditor } from './useThemeSpacingEditor';

export const useThemeEditor = () => {
  const {
    themeSettings,
    setThemeSettings,
    isLoading,
    isSaving,
    loadThemeSettings,
    saveThemeSettings,
  } = useThemeStorage();

  const { handleColorChange } = useThemeColorEditor(
    themeSettings,
    setThemeSettings
  );
  const { handleTypographyChange } = useThemeTypographyEditor(
    themeSettings,
    setThemeSettings
  );
  const { handleSpacingChange } = useThemeSpacingEditor(
    themeSettings,
    setThemeSettings
  );

  // Load theme settings when the component mounts
  useEffect(() => {
    loadThemeSettings();
  }, [loadThemeSettings]);

  return {
    themeSettings,
    setThemeSettings,
    isLoading,
    isSaving,
    loadThemeSettings,
    saveThemeSettings,
    handleColorChange,
    handleTypographyChange,
    handleSpacingChange,
  };
};
