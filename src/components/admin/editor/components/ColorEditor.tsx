
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorSet } from '@/context/theme';

interface ColorEditorProps {
  color: ColorSet;
  onChange: (hex: string) => void;
  label: string;
}

export const ColorEditor: React.FC<ColorEditorProps> = ({ color, onChange, label }) => {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div 
          className="w-6 h-6 rounded border"
          style={{ backgroundColor: color.hex }}
        />
      </div>
      
      <div className="flex gap-2">
        <Input
          type="color"
          value={color.hex}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 p-1"
        />
        <Input
          type="text"
          value={color.hex}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono"
        />
      </div>
      
      <p className="mt-1 text-xs text-muted-foreground">{color.usage}</p>
    </div>
  );
};
