
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TemplateSelector, LayoutTemplate } from './components/TemplateSelector';
import { TemplatePreview } from './components/TemplatePreview';
import { LayoutInstructions } from './components/LayoutInstructions';
import { useLayoutData } from './hooks/useLayoutData';

interface LayoutEditorProps {
  onChange: () => void;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({ onChange }) => {
  // Available layout templates
  const templates: LayoutTemplate[] = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Default page layout with header, content sections, and footer',
      sections: [
        { id: 'header', name: 'Header', components: [] },
        { id: 'main', name: 'Main Content', components: [] },
        { id: 'footer', name: 'Footer', components: [] }
      ]
    },
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Optimized for landing pages with hero, features, and CTA sections',
      isNew: true,
      sections: [
        { id: 'hero', name: 'Hero Section', components: [] },
        { id: 'features', name: 'Features', components: [] },
        { id: 'testimonials', name: 'Testimonials', components: [] },
        { id: 'cta', name: 'Call to Action', components: [] },
        { id: 'footer', name: 'Footer', components: [] }
      ]
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Blog layout with header, content area, and sidebar',
      sections: [
        { id: 'header', name: 'Header', components: [] },
        { id: 'main', name: 'Content', components: [] },
        { id: 'sidebar', name: 'Sidebar', components: [] },
        { id: 'footer', name: 'Footer', components: [] }
      ]
    },
    {
      id: 'service',
      name: 'Service Page',
      description: 'Layout for showcasing specific services',
      sections: [
        { id: 'header', name: 'Header', components: [] },
        { id: 'service-hero', name: 'Service Hero', components: [] },
        { id: 'service-details', name: 'Service Details', components: [] },
        { id: 'related-services', name: 'Related Services', components: [] },
        { id: 'contact', name: 'Contact Section', components: [] },
        { id: 'footer', name: 'Footer', components: [] }
      ]
    }
  ];

  const {
    selectedTemplate,
    layoutData,
    isLoading,
    handleTemplateChange,
    handleSaveLayout
  } = useLayoutData(onChange);

  // Handle the save layout action
  const onSaveLayout = async () => {
    const success = await handleSaveLayout();
    if (success) {
      toast.success('Layout saved successfully');
    } else {
      toast.error('Failed to save layout');
    }
  };

  // Get sections for the current template
  const currentTemplateSections = templates.find(t => t.id === selectedTemplate)?.sections || [];

  return (
    <div className="space-y-6">
      <TemplateSelector 
        selectedTemplate={selectedTemplate} 
        templates={templates} 
        onTemplateChange={(value) => handleTemplateChange(value, templates)} 
      />

      {/* Template preview */}
      <TemplatePreview sections={currentTemplateSections} />

      <div className="flex justify-end">
        <Button
          onClick={onSaveLayout}
          disabled={isLoading}
          className="bg-[#ab233a] hover:bg-[#811a2c]"
        >
          {isLoading ? 'Saving...' : 'Save Layout'}
        </Button>
      </div>

      <LayoutInstructions />
    </div>
  );
};
