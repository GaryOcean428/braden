
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ColorSet = {
  name: string;
  hex: string;
  description: string;
  usage: string;
};

export type ThemeSettings = {
  colors: {
    primary: ColorSet[];
    secondary: ColorSet[];
    extended: ColorSet[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
  };
  spacing: {
    baseSpacingUnit: string;
    spacingScale: string;
  };
};

// Default theme based on Braden Group brand colors
const defaultTheme: ThemeSettings = {
  colors: {
    primary: [
      {
        name: 'Braden Red',
        hex: '#ab233a',
        description: 'Primary brand color',
        usage: 'Main text, primary headers, important announcements'
      },
      {
        name: 'Braden Dark Red',
        hex: '#811a2c',
        description: 'Darker variant of primary color',
        usage: 'Secondary headers, footers, subheadings'
      },
      {
        name: 'Braden Gold',
        hex: '#cbb26a',
        description: 'Primary accent color',
        usage: 'Highlighting key points, accents in headers and footers'
      }
    ],
    secondary: [
      {
        name: 'Braden Light Gold',
        hex: '#d8c690',
        description: 'Lighter variant of accent color',
        usage: 'Backgrounds for highlighted sections, borders, subtle accents'
      },
      {
        name: 'Braden Bronze',
        hex: '#be9e44',
        description: 'Darker variant of accent color',
        usage: 'Decorative elements, dividers, icons'
      }
    ],
    extended: [
      {
        name: 'Braden Navy',
        hex: '#2c3e50',
        description: 'Dark blue color',
        usage: 'Primary text for business documents, headers, footers'
      },
      {
        name: 'Braden Slate',
        hex: '#95a5a6',
        description: 'Light gray color',
        usage: 'Secondary text, subheadings, backgrounds for highlighted sections'
      },
      {
        name: 'Braden Sky',
        hex: '#3498db',
        description: 'Bright blue color',
        usage: 'Call-to-action buttons, links, highlights'
      },
      {
        name: 'Braden Forest',
        hex: '#27ae60',
        description: 'Green color',
        usage: 'Accents, highlights, graphical elements'
      },
      {
        name: 'Braden Lavender',
        hex: '#9b59b6',
        description: 'Purple color',
        usage: 'Subtle accents, highlight sections, decorative elements'
      }
    ]
  },
  typography: {
    headingFont: 'Montserrat, sans-serif',
    bodyFont: 'Inter, sans-serif',
    baseFontSize: '16px'
  },
  spacing: {
    baseSpacingUnit: '4px',
    spacingScale: '1.5'
  }
};

type ThemeContextType = {
  theme: ThemeSettings;
  applyTheme: (theme: ThemeSettings) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  applyTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThemeFromDb = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('type', 'theme')
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error('Error loading theme:', error);
          }
          return;
        }
        
        if (data && data.settings) {
          const loadedTheme = data.settings as ThemeSettings;
          setTheme(loadedTheme);
          applyThemeToCss(loadedTheme);
        }
      } catch (error) {
        console.error('Error loading theme settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeFromDb();
  }, []);

  const applyThemeToCss = (themeToApply: ThemeSettings) => {
    // Apply colors
    themeToApply.colors.primary.forEach((color, index) => {
      document.documentElement.style.setProperty(`--primary-color-${index + 1}`, color.hex);
    });
    
    themeToApply.colors.secondary.forEach((color, index) => {
      document.documentElement.style.setProperty(`--secondary-color-${index + 1}`, color.hex);
    });
    
    themeToApply.colors.extended.forEach((color, index) => {
      document.documentElement.style.setProperty(`--extended-color-${index + 1}`, color.hex);
    });
    
    // Apply typography
    document.documentElement.style.setProperty('--heading-font', themeToApply.typography.headingFont);
    document.documentElement.style.setProperty('--body-font', themeToApply.typography.bodyFont);
    document.documentElement.style.setProperty('--base-font-size', themeToApply.typography.baseFontSize);
    
    // Apply spacing
    document.documentElement.style.setProperty('--base-spacing-unit', themeToApply.typography.baseFontSize);
    document.documentElement.style.setProperty('--spacing-scale', themeToApply.spacing.spacingScale);
    
    // Apply to Tailwind CSS variables
    document.documentElement.style.setProperty(
      '--primary', 
      getHslFromHex(themeToApply.colors.primary[0].hex)
    );
    document.documentElement.style.setProperty(
      '--secondary', 
      getHslFromHex(themeToApply.colors.secondary[0].hex)
    );
  };
  
  // Helper function to convert hex to hsl format for Tailwind CSS variables
  const getHslFromHex = (hex: string): string => {
    // Remove the # if it exists
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find greatest and smallest values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    // Calculate lightness - changed from const to let since we need to modify it later
    let l = (max + min) / 2;
    
    // Calculate saturation
    let s = 0;
    if (max !== min) {
      s = l > 0.5 
        ? (max - min) / (2 - max - min) 
        : (max - min) / (max + min);
    }
    
    // Calculate hue
    let h = 0;
    if (max !== min) {
      if (max === r) {
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / (max - min) + 2;
      } else {
        h = (r - g) / (max - min) + 4;
      }
      h *= 60;
    }
    
    // Round values
    h = Math.round(h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  };

  const applyTheme = (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    applyThemeToCss(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
