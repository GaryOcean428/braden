
import React from 'react';

export const ComponentInstructions: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-md border">
      <h4 className="text-base font-medium mb-2">Using Components</h4>
      <ol className="text-sm text-gray-500 list-decimal pl-5 space-y-1">
        <li>Drag a component from the library to your layout in the Layout Editor</li>
        <li>Configure component properties in the properties panel</li>
        <li>Save changes to update the live site</li>
      </ol>
    </div>
  );
};
