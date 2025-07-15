import React from 'react';

export const LayoutInstructions = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-md border">
      <h4 className="text-base font-medium mb-2">Layout Editor Instructions</h4>
      <ol className="text-sm text-gray-500 list-decimal pl-5 space-y-1">
        <li>Select a template that best fits your page structure</li>
        <li>
          Drag components from the Component Library to add them to sections
        </li>
        <li>Arrange components within sections by dragging</li>
        <li>Save your layout when you're satisfied with the structure</li>
      </ol>
    </div>
  );
};
