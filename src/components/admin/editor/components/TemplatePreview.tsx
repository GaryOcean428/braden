
import React from 'react';
import { LayoutSection } from './TemplateSelector';

interface TemplatePreviewProps {
  sections: LayoutSection[];
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ sections }) => {
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <h4 className="font-medium mb-2">Template Structure</h4>
      <div className="space-y-2">
        {sections.map((section) => (
          <div 
            key={section.id}
            className="p-3 bg-white border rounded-md hover:border-[#ab233a] transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{section.name}</span>
              <span className="text-sm text-gray-500">{section.components.length} components</span>
            </div>
            
            {section.components.length === 0 && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-500 text-center">
                Drag components here
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
