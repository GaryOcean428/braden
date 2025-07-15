import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ThemeSettings, defaultTheme } from './types';
import { applyThemeToCss } from './colorUtils';

type ThemeContextType = {
  theme: ThemeSettings;
  applyTheme: (theme: ThemeSettings) => void;
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  applyTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
          if (error.code !== 'PGRST116') {
            // Not found error
            console.error('Error loading theme:', error);
          }
          // Use default theme if no theme is found
          applyThemeToCss(defaultTheme);
          return;
        }

        if (data && data.settings) {
          const loadedTheme = data.settings as ThemeSettings;
          setTheme(loadedTheme);
          applyThemeToCss(loadedTheme);
        } else {
          // Use default theme if settings are empty
          applyThemeToCss(defaultTheme);
        }
      } catch (error) {
        console.error('Error loading theme settings:', error);
        // Fall back to default theme on error
        applyThemeToCss(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemeFromDb();
  }, []);

  const applyTheme = (themeToApply: ThemeSettings) => {
    setTheme(themeToApply);
    applyThemeToCss(themeToApply);
  };

  return (
    <ThemeContext.Provider value={{ theme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
