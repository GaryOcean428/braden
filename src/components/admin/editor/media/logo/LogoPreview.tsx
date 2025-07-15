import React from 'react';
import { LogoPreviewProps } from './types';

export const LogoPreview: React.FC<LogoPreviewProps> = ({
  url,
  title,
  className = 'max-h-32 object-contain',
}) => {
  if (!url) return null;

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="border rounded-md p-4 bg-gray-50 flex justify-center">
        <img src={url} alt={title} className={className} />
      </div>
    </div>
  );
};
