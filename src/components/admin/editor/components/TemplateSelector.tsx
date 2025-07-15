import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  isNew?: boolean;
  sections: LayoutSection[];
}

export interface LayoutSection {
  id: string;
  name: string;
  components: any[];
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  templates: LayoutTemplate[];
  onTemplateChange: (value: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  templates,
  onTemplateChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="text-lg font-semibold">Layout Template</h3>
        <p className="text-sm text-gray-500">
          Select a template to structure your page
        </p>
      </div>
      <Select value={selectedTemplate} onValueChange={onTemplateChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}{' '}
              {template.isNew && (
                <span className="ml-2 text-xs bg-[#ab233a] text-white px-1 py-0.5 rounded">
                  NEW
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
