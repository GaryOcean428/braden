
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeSettings } from '@/context/theme';

interface SpacingPanelProps {
  spacing: ThemeSettings['spacing'];
  onSpacingChange: (field: keyof ThemeSettings['spacing'], value: string) => void;
}

export const SpacingPanel: React.FC<SpacingPanelProps> = ({
  spacing,
  onSpacingChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <Label htmlFor="baseSpacingUnit" className="text-sm font-medium">Base Spacing Unit</Label>
          <Input
            id="baseSpacingUnit"
            value={spacing.baseSpacingUnit}
            onChange={(e) => onSpacingChange('baseSpacingUnit', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Base unit for spacing (e.g., 4px)</p>
        </div>
        
        <div>
          <Label htmlFor="spacingScale" className="text-sm font-medium">Spacing Scale</Label>
          <Input
            id="spacingScale"
            value={spacing.spacingScale}
            onChange={(e) => onSpacingChange('spacingScale', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Scale factor for spacing (e.g., 1.5)</p>
        </div>
      </CardContent>
    </Card>
  );
};
