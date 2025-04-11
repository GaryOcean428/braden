
/**
 * Converts a hex color code to HSL format for Tailwind CSS variables
 */
export const getHslFromHex = (hex: string): string => {
  // Remove the # if it exists
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find greatest and smallest values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate lightness
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

/**
 * Applies theme settings to CSS custom properties
 */
export const applyThemeToCss = (theme: any) => {
  // Apply colors
  theme.colors.primary.forEach((color: any, index: number) => {
    document.documentElement.style.setProperty(`--primary-color-${index + 1}`, color.hex);
  });
  
  theme.colors.secondary.forEach((color: any, index: number) => {
    document.documentElement.style.setProperty(`--secondary-color-${index + 1}`, color.hex);
  });
  
  theme.colors.extended.forEach((color: any, index: number) => {
    document.documentElement.style.setProperty(`--extended-color-${index + 1}`, color.hex);
  });
  
  // Apply typography - ensure proper quoting for font families
  document.documentElement.style.setProperty('--heading-font', theme.typography.headingFont);
  document.documentElement.style.setProperty('--body-font', theme.typography.bodyFont);
  document.documentElement.style.setProperty('--base-font-size', theme.typography.baseFontSize);
  
  // Apply spacing
  document.documentElement.style.setProperty('--base-spacing-unit', theme.spacing.baseSpacingUnit);
  document.documentElement.style.setProperty('--spacing-scale', theme.spacing.spacingScale);
  
  // Apply to Tailwind CSS variables
  document.documentElement.style.setProperty(
    '--primary', 
    getHslFromHex(theme.colors.primary[0].hex)
  );
  document.documentElement.style.setProperty(
    '--secondary', 
    getHslFromHex(theme.colors.primary[2].hex)
  );
  
  // Force refresh font styles
  const bodyStyle = document.body.style;
  bodyStyle.fontFamily = theme.typography.bodyFont;
  
  // Update heading fonts
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headingElements.forEach(el => {
    (el as HTMLElement).style.fontFamily = theme.typography.headingFont;
  });

  // Update form elements to inherit fonts properly
  const formElements = document.querySelectorAll('button, input, select, textarea');
  formElements.forEach(el => {
    (el as HTMLElement).style.fontFamily = theme.typography.bodyFont;
  });
};
