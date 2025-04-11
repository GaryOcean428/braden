
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeSettings } from '@/context/ThemeContext';

interface TypographyPanelProps {
  typography: ThemeSettings['typography'];
  onTypographyChange: (field: keyof ThemeSettings['typography'], value: string) => void;
}

export const TypographyPanel: React.FC<TypographyPanelProps> = ({
  typography,
  onTypographyChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <Label htmlFor="headingFont" className="text-sm font-medium">Heading Font</Label>
          <Input
            id="headingFont"
            value={typography.headingFont}
            onChange={(e) => onTypographyChange('headingFont', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Font family for headings (h1, h2, etc.)</p>
        </div>
        
        <div>
          <Label htmlFor="bodyFont" className="text-sm font-medium">Body Font</Label>
          <Input
            id="bodyFont"
            value={typography.bodyFont}
            onChange={(e) => onTypographyChange('bodyFont', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Font family for body text</p>
        </div>
        
        <div>
          <Label htmlFor="baseFontSize" className="text-sm font-medium">Base Font Size</Label>
          <Input
            id="baseFontSize"
            value={typography.baseFontSize}
            onChange={(e) => onTypographyChange('baseFontSize', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Base font size (e.g., 16px)</p>
        </div>
      </CardContent>
    </Card>
  );
};
