import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useThemeEditor } from '@/hooks/theme';
import { toast } from 'sonner';
import { ColorsPanel } from './components/ColorsPanel';
import { TypographyPanel } from './components/TypographyPanel';
import { SpacingPanel } from './components/SpacingPanel';

export const ThemeEditor: React.FC<{ onChange?: () => void }> = ({ onChange }) => {
  const { 
    themeSettings, 
    isLoading, 
    isSaving,
    loadThemeSettings, 
    saveThemeSettings,
    handleColorChange,
    handleTypographyChange,
    handleSpacingChange
  } = useThemeEditor();
  
  useEffect(() => {
    loadThemeSettings();
  }, [loadThemeSettings]);
  
  // When theme settings change, notify parent component
  useEffect(() => {
    if (onChange && !isLoading && !isSaving && themeSettings) {
      onChange();
    }
  }, [themeSettings, isLoading, isSaving, onChange]);
  
  if (isLoading || !themeSettings) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-braden-red" />
      </div>
    );
  }
  
  const handleSave = async () => {
    await saveThemeSettings();
    toast.success("Theme settings saved successfully");
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="colors">
        <TabsList className="mb-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors">
          <ColorsPanel 
            primaryColors={themeSettings.colors.primary}
            secondaryColors={themeSettings.colors.secondary}
            extendedColors={themeSettings.colors.extended}
            onColorChange={handleColorChange}
          />
        </TabsContent>
        
        <TabsContent value="typography">
          <TypographyPanel 
            typography={themeSettings.typography}
            onTypographyChange={handleTypographyChange}
          />
        </TabsContent>
        
        <TabsContent value="spacing">
          <SpacingPanel 
            spacing={themeSettings.spacing}
            onSpacingChange={handleSpacingChange}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-braden-red hover:bg-braden-dark-red"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Theme Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
