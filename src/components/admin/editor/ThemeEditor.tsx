
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { useThemeEditor } from '@/hooks/useThemeEditor';
import { toast } from 'sonner';

// Define the ColorEditor component for individual color inputs
const ColorEditor = ({ 
  color, 
  onChange, 
  label 
}: { 
  color: { name: string; hex: string; description: string; usage: string }; 
  onChange: (hex: string) => void;
  label: string;
}) => {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div 
          className="w-6 h-6 rounded border"
          style={{ backgroundColor: color.hex }}
        />
      </div>
      
      <div className="flex gap-2">
        <Input
          type="color"
          value={color.hex}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 p-1"
        />
        <Input
          type="text"
          value={color.hex}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono"
        />
      </div>
      
      <p className="mt-1 text-xs text-muted-foreground">{color.usage}</p>
    </div>
  );
};

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Primary Colors</h3>
                
                {themeSettings?.colors.primary.map((color, index) => (
                  <ColorEditor
                    key={`primary-${index}`}
                    color={color}
                    onChange={(hex) => handleColorChange('primary', index, 'hex', hex)}
                    label={color.name}
                  />
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Secondary Colors</h3>
                
                {themeSettings?.colors.secondary.map((color, index) => (
                  <ColorEditor
                    key={`secondary-${index}`}
                    color={color}
                    onChange={(hex) => handleColorChange('secondary', index, 'hex', hex)}
                    label={color.name}
                  />
                ))}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Extended Colors</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {themeSettings?.colors.extended.map((color, index) => (
                    <ColorEditor
                      key={`extended-${index}`}
                      color={color}
                      onChange={(hex) => handleColorChange('extended', index, 'hex', hex)}
                      label={color.name}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="typography">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <Label htmlFor="headingFont" className="text-sm font-medium">Heading Font</Label>
                <Input
                  id="headingFont"
                  value={themeSettings?.typography.headingFont}
                  onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Font family for headings (h1, h2, etc.)</p>
              </div>
              
              <div>
                <Label htmlFor="bodyFont" className="text-sm font-medium">Body Font</Label>
                <Input
                  id="bodyFont"
                  value={themeSettings?.typography.bodyFont}
                  onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Font family for body text</p>
              </div>
              
              <div>
                <Label htmlFor="baseFontSize" className="text-sm font-medium">Base Font Size</Label>
                <Input
                  id="baseFontSize"
                  value={themeSettings?.typography.baseFontSize}
                  onChange={(e) => handleTypographyChange('baseFontSize', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Base font size (e.g., 16px)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spacing">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <Label htmlFor="baseSpacingUnit" className="text-sm font-medium">Base Spacing Unit</Label>
                <Input
                  id="baseSpacingUnit"
                  value={themeSettings?.spacing.baseSpacingUnit}
                  onChange={(e) => handleSpacingChange('baseSpacingUnit', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Base unit for spacing (e.g., 4px)</p>
              </div>
              
              <div>
                <Label htmlFor="spacingScale" className="text-sm font-medium">Spacing Scale</Label>
                <Input
                  id="spacingScale"
                  value={themeSettings?.spacing.spacingScale}
                  onChange={(e) => handleSpacingChange('spacingScale', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Scale factor for spacing (e.g., 1.5)</p>
              </div>
            </CardContent>
          </Card>
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
