
// Braden Group theme configuration
export const theme = {
  colors: {
    primary: {
      DEFAULT: '#ab233a',
      dark: '#811a2c',
      light: '#d8c690',
    },
    navy: '#2c3e50',
    slate: '#95a5a6',
    gold: '#cbb26a',
  },
  fontFamily: {
    heading: 'Montserrat, sans-serif',
    body: 'Inter, sans-serif',
  },
  spacing: {
    base: '0.25rem', // 4px
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
  },
  transition: {
    DEFAULT: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
} as const;
