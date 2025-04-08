
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ThemeSettings {
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
}

export interface ColorSet {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  usage: string;
}

interface ThemeContextType {
  theme: ThemeSettings | null;
  loading: boolean;
  applyTheme: (theme: ThemeSettings) => void;
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

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  loading: true,
  applyTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Load theme on initial mount
  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('settings')
        .eq('type', 'theme')
        .single() as any;
      
      if (error) {
        if (error.code === 'PGRST116') { // Not found
          // Apply default theme if no theme is stored
          setTheme(defaultTheme);
        } else {
          console.error("Error fetching theme:", error);
          toast.error("Failed to load theme settings");
          // Fallback to default theme on error
          setTheme(defaultTheme);
        }
      } else if (data) {
        setTheme(data.settings);
      } else {
        // Fallback to default theme
        setTheme(defaultTheme);
      }
    } catch (err) {
      console.error("Error loading theme:", err);
      // Fallback to default theme
      setTheme(defaultTheme);
    } finally {
      setLoading(false);
    }
  };

  // Apply theme to the application
  const applyTheme = (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    
    // Set CSS variables
    const root = document.documentElement;
    
    // Set primary colors
    newTheme.colors.primary.forEach((color, index) => {
      root.style.setProperty(`--primary-color-${index + 1}`, color.hex);
    });
    
    // Set secondary colors
    newTheme.colors.secondary.forEach((color, index) => {
      root.style.setProperty(`--secondary-color-${index + 1}`, color.hex);
    });
    
    // Set extended colors
    newTheme.colors.extended.forEach((color, index) => {
      root.style.setProperty(`--extended-color-${index + 1}`, color.hex);
    });
    
    // Set typography
    root.style.setProperty('--heading-font', newTheme.typography.headingFont);
    root.style.setProperty('--body-font', newTheme.typography.bodyFont);
    root.style.setProperty('--base-font-size', newTheme.typography.baseSize);
    
    // Set spacing
    root.style.setProperty('--base-spacing-unit', newTheme.spacing.baseUnit);
    root.style.setProperty('--spacing-scale', newTheme.spacing.scale);
    
    // Apply the main colors to existing Tailwind variables
    root.style.setProperty('--primary', newTheme.colors.primary[0].hex);
    root.style.setProperty('--secondary', newTheme.colors.secondary[0].hex);
  };

  useEffect(() => {
    if (theme) {
      applyTheme(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, loading, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
