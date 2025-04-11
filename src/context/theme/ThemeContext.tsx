
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ThemeSettings, defaultTheme } from './types';
import { applyThemeToCss } from './colorUtils';

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
