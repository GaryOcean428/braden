import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ColorEditor } from './ColorEditor';
import { ColorSet } from '@/context/theme';

interface ColorsPanelProps {
  primaryColors: ColorSet[];
  secondaryColors: ColorSet[];
  extendedColors: ColorSet[];
  onColorChange: (
    category: 'primary' | 'secondary' | 'extended',
    index: number,
    field: keyof ColorSet,
    value: string
  ) => void;
}

export const ColorsPanel: React.FC<ColorsPanelProps> = ({
  primaryColors,
  secondaryColors,
  extendedColors,
  onColorChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Primary Colors</h3>

          {primaryColors.map((color, index) => (
            <ColorEditor
              key={`primary-${index}`}
              color={color}
              onChange={(hex) => onColorChange('primary', index, 'hex', hex)}
              label={color.name}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Secondary Colors</h3>

          {secondaryColors.map((color, index) => (
            <ColorEditor
              key={`secondary-${index}`}
              color={color}
              onChange={(hex) => onColorChange('secondary', index, 'hex', hex)}
              label={color.name}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Extended Colors</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extendedColors.map((color, index) => (
              <ColorEditor
                key={`extended-${index}`}
                color={color}
                onChange={(hex) => onColorChange('extended', index, 'hex', hex)}
                label={color.name}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
