
import React from 'react';

interface ColorSwatchProps {
  name: string;
  hex: string;
  rgb?: string;
  hsl?: string;
  usage?: string;
  onClick?: () => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  name, 
  hex, 
  rgb, 
  hsl, 
  usage, 
  onClick 
}) => {
  return (
    <div 
      className="border rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div 
        className="h-16 w-full" 
        style={{ backgroundColor: hex }}
      />
      <div className="p-3 space-y-1">
        <h4 className="font-semibold text-sm">{name}</h4>
        <p className="text-xs text-gray-500">{hex}</p>
        {rgb && <p className="text-xs text-gray-500">{rgb}</p>}
        {usage && (
          <p className="text-xs text-gray-600 mt-1 border-t pt-1">{usage}</p>
        )}
      </div>
    </div>
  );
};
