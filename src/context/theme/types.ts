
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
export const defaultTheme: ThemeSettings = {
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
