import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ThemeEditorProps {
  onChange: () => void;
}

interface ColorSet {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  usage: string;
}

interface ThemeSettings {
  id?: string;
  colors: {
    primary: ColorSet[];
    secondary: ColorSet[];
    extended: ColorSet[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
  };
  spacing: {
    baseUnit: string;
    scale: string;
  };
  updated_at?: string;
}

const defaultTheme: ThemeSettings = {
  colors: {
    primary: [
      {
        name: "Braden Red",
        hex: "#ab233a",
        rgb: "171, 35, 58",
        hsl: "350, 66%, 40%",
        usage: "Main text, primary headers, important announcements"
      },
      {
        name: "Braden Dark Red",
        hex: "#811a2c",
        rgb: "129, 26, 44",
        hsl: "350, 66%, 30%",
        usage: "Secondary headers, footers, subheadings"
      },
      {
        name: "Braden Gold",
        hex: "#cbb26a",
        rgb: "203, 178, 106",
        hsl: "45, 48%, 61%",
        usage: "Highlighting key points, accents, call-to-action text"
      }
    ],
    secondary: [
      {
        name: "Braden Light Gold",
        hex: "#d8c690",
        rgb: "216, 198, 144",
        hsl: "45, 48%, 71%",
        usage: "Backgrounds for highlighted sections, borders, subtle accents"
      },
      {
        name: "Braden Bronze",
        hex: "#be9e44",
        rgb: "190, 158, 68",
        hsl: "45, 48%, 51%",
        usage: "Decorative elements, dividers, icons"
      }
    ],
    extended: [
      {
        name: "Braden Navy",
        hex: "#2c3e50",
        rgb: "44, 62, 80",
        hsl: "210, 45%, 24%",
        usage: "Primary text for business documents, headers, footers"
      },
      {
        name: "Braden Slate",
        hex: "#95a5a6",
        rgb: "149, 165, 166",
        hsl: "180, 7%, 62%",
        usage: "Secondary text, subheadings, backgrounds"
      },
      {
        name: "Braden Sky",
        hex: "#3498db",
        rgb: "52, 152, 219",
        hsl: "204, 70%, 53%",
        usage: "Call-to-action buttons, links, highlights"
      },
      {
        name: "Braden Forest",
        hex: "#27ae60",
        rgb: "39, 174, 96",
        hsl: "145, 63%, 42%",
        usage: "Accents, highlights, graphical elements"
      },
      {
        name: "Braden Lavender",
        hex: "#9b59b6",
        rgb: "155, 89, 182",
        hsl: "282, 39%, 53%",
        usage: "Subtle accents, highlight sections, decorative elements"
      }
    ]
  },
  typography: {
    headingFont: "Montserrat, sans-serif",
    bodyFont: "Inter, sans-serif",
    baseSize: "16px"
  },
  spacing: {
    baseUnit: "4px",
    scale: "1.5"
  }
};

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ onChange }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("colors");

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch theme settings from Supabase
      // Using type assertion to fix TypeScript error
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
        setThemeSettings({
          ...data.settings,
          id: data.id,
          updated_at: data.updated_at
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load theme settings");
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemeSettings = async () => {
    try {
      setIsSaving(true);
      
      // Save theme settings to Supabase
      if (themeSettings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('site_settings' as any)
          .update({
            settings: themeSettings,
            updated_at: new Date().toISOString()
          })
          .eq('id', themeSettings.id) as any;
          
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
      
      toast.success("Theme settings saved successfully");
    } catch (error) {
      console.error("Error saving theme settings:", error);
      toast.error("Failed to save theme settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm("Are you sure you want to reset to default theme settings?");
    if (confirmed) {
      setThemeSettings(defaultTheme);
      onChange();
      toast.info("Theme reset to defaults");
    }
  };

  const handleColorChange = (
    category: 'primary' | 'secondary' | 'extended',
    index: number,
    field: keyof ColorSet,
    value: string
  ) => {
    setThemeSettings(prev => {
      const newSettings = { ...prev };
      newSettings.colors[category][index][field] = value;
      return newSettings;
    });
    onChange();
  };

  const handleTypographyChange = (field: keyof ThemeSettings['typography'], value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [field]: value
      }
    }));
    onChange();
  };

  const handleSpacingChange = (field: keyof ThemeSettings['spacing'], value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [field]: value
      }
    }));
    onChange();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-[#ab233a]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Theme Settings</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button 
            onClick={saveThemeSettings} 
            disabled={isSaving}
            className="flex items-center gap-1"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Theme
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-6 pt-4">
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Primary Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themeSettings.colors.primary.map((color, index) => (
                <Card key={`primary-${index}`} className="overflow-hidden">
                  <div 
                    className="h-16 w-full" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <Label htmlFor={`primary-${index}-name`}>Name</Label>
                      <Input
                        id={`primary-${index}-name`}
                        value={color.name}
                        onChange={(e) => handleColorChange('primary', index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`primary-${index}-hex`}>Hex Value</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`primary-${index}-hex`}
                          value={color.hex}
                          onChange={(e) => handleColorChange('primary', index, 'hex', e.target.value)}
                        />
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => handleColorChange('primary', index, 'hex', e.target.value)}
                          className="p-1 h-10 w-12 border rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`primary-${index}-usage`}>Usage</Label>
                      <Input
                        id={`primary-${index}-usage`}
                        value={color.usage}
                        onChange={(e) => handleColorChange('primary', index, 'usage', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-lg">Secondary Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themeSettings.colors.secondary.map((color, index) => (
                <Card key={`secondary-${index}`} className="overflow-hidden">
                  <div 
                    className="h-16 w-full" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <Label htmlFor={`secondary-${index}-name`}>Name</Label>
                      <Input
                        id={`secondary-${index}-name`}
                        value={color.name}
                        onChange={(e) => handleColorChange('secondary', index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`secondary-${index}-hex`}>Hex Value</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`secondary-${index}-hex`}
                          value={color.hex}
                          onChange={(e) => handleColorChange('secondary', index, 'hex', e.target.value)}
                        />
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => handleColorChange('secondary', index, 'hex', e.target.value)}
                          className="p-1 h-10 w-12 border rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`secondary-${index}-usage`}>Usage</Label>
                      <Input
                        id={`secondary-${index}-usage`}
                        value={color.usage}
                        onChange={(e) => handleColorChange('secondary', index, 'usage', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-lg">Extended Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themeSettings.colors.extended.map((color, index) => (
                <Card key={`extended-${index}`} className="overflow-hidden">
                  <div 
                    className="h-16 w-full" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <Label htmlFor={`extended-${index}-name`}>Name</Label>
                      <Input
                        id={`extended-${index}-name`}
                        value={color.name}
                        onChange={(e) => handleColorChange('extended', index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`extended-${index}-hex`}>Hex Value</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`extended-${index}-hex`}
                          value={color.hex}
                          onChange={(e) => handleColorChange('extended', index, 'hex', e.target.value)}
                        />
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => handleColorChange('extended', index, 'hex', e.target.value)}
                          className="p-1 h-10 w-12 border rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`extended-${index}-usage`}>Usage</Label>
                      <Input
                        id={`extended-${index}-usage`}
                        value={color.usage}
                        onChange={(e) => handleColorChange('extended', index, 'usage', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-6 pt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="headingFont">Heading Font</Label>
                <Input
                  id="headingFont"
                  value={themeSettings.typography.headingFont}
                  onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="bodyFont">Body Font</Label>
                <Input
                  id="bodyFont"
                  value={themeSettings.typography.bodyFont}
                  onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="baseSize">Base Font Size</Label>
                <Input
                  id="baseSize"
                  value={themeSettings.typography.baseSize}
                  onChange={(e) => handleTypographyChange('baseSize', e.target.value)}
                />
              </div>
              
              <div className="border p-4 rounded-md mt-8">
                <h3 className="text-xl mb-2">Typography Preview</h3>
                <div className="space-y-4">
                  <div>
                    <h1 className="text-4xl" style={{ fontFamily: themeSettings.typography.headingFont }}>
                      Heading 1
                    </h1>
                    <h2 className="text-3xl" style={{ fontFamily: themeSettings.typography.headingFont }}>
                      Heading 2
                    </h2>
                    <h3 className="text-2xl" style={{ fontFamily: themeSettings.typography.headingFont }}>
                      Heading 3
                    </h3>
                    <h4 className="text-xl" style={{ fontFamily: themeSettings.typography.headingFont }}>
                      Heading 4
                    </h4>
                  </div>
                  
                  <div style={{ 
                    fontFamily: themeSettings.typography.bodyFont, 
                    fontSize: themeSettings.typography.baseSize 
                  }}>
                    <p className="mb-3">
                      This is a paragraph of text that demonstrates the body font style. 
                      The font family is {themeSettings.typography.bodyFont} with a base size of {themeSettings.typography.baseSize}.
                    </p>
                    <p>
                      <strong>Bold text</strong> and <em>italicized text</em> also use this font family.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spacing" className="space-y-6 pt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="baseUnit">Base Unit</Label>
                <Input
                  id="baseUnit"
                  value={themeSettings.spacing.baseUnit}
                  onChange={(e) => handleSpacingChange('baseUnit', e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Base unit of measurement for spacing (e.g., 4px)
                </p>
              </div>
              
              <div>
                <Label htmlFor="scale">Scale Factor</Label>
                <Input
                  id="scale"
                  value={themeSettings.spacing.scale}
                  onChange={(e) => handleSpacingChange('scale', e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Multiplier used to calculate spacing increments (e.g., 1.5)
                </p>
              </div>
              
              <div className="border p-4 rounded-md mt-8">
                <h3 className="text-xl mb-4">Spacing Preview</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 6, 8].map((factor) => {
                    const size = `${parseInt(themeSettings.spacing.baseUnit) * 
                      Math.pow(parseFloat(themeSettings.spacing.scale), factor - 1)}px`;
                    
                    return (
                      <div key={factor} className="flex items-center gap-4">
                        <div 
                          className="bg-gray-200" 
                          style={{ 
                            width: size,
                            height: '20px'
                          }}
                        ></div>
                        <span>Space {factor}: {size}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
