
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/database.types';
import { EmptyResults } from './components';

interface Section {
  id: string;
  name: string;
  components: any[];
}

interface LayoutData {
  template: string;
  sections: Section[];
  lastUpdated: string;
}

interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  isNew?: boolean;
  sections: Section[];
}

interface LayoutEditorProps {
  onChange: () => void;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({ onChange }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [layoutData, setLayoutData] = useState<LayoutData>({
    template: 'standard',
    sections: [],
    lastUpdated: new Date().toISOString()
  });

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

  // Load layout from database
  useEffect(() => {
    const loadLayout = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('page_layouts')
          .select('*')
          .eq('page_id', 'home')
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error('Error loading layout:', error);
          }
          return;
        }
        
        if (data && data.layout_data) {
          // Properly type cast the JSON data to our LayoutData type
          const layoutFromDb = data.layout_data as Json;
          
          // Validate the structure before assigning
          if (
            typeof layoutFromDb === 'object' && 
            layoutFromDb !== null && 
            !Array.isArray(layoutFromDb) && 
            'template' in layoutFromDb
          ) {
            setLayoutData(layoutFromDb as unknown as LayoutData);
            setSelectedTemplate((layoutFromDb as any).template || 'standard');
          }
        }
      } catch (error) {
        console.error('Error loading layout:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLayout();
  }, []);

  // Change the selected template
  const handleTemplateChange = (value: string) => {
    const template = templates.find(t => t.id === value);
    if (template) {
      setSelectedTemplate(value);
      
      // Update the layout data with the new template
      setLayoutData({
        template: value,
        sections: template.sections,
        lastUpdated: new Date().toISOString()
      });
      
      onChange(); // Notify parent of change
      
      toast.info(`Template changed to ${template.name}`);
    }
  };

  // Save the layout to the database
  const handleSaveLayout = async () => {
    try {
      setIsLoading(true);
      
      // Prepare layout data as Json compatible object
      const jsonLayoutData: Json = {
        template: layoutData.template,
        sections: layoutData.sections,
        lastUpdated: layoutData.lastUpdated
      };
      
      // First check if a layout exists for this page
      const { data: existingLayout } = await supabase
        .from('page_layouts')
        .select('id')
        .eq('page_id', 'home')
        .maybeSingle();
      
      if (existingLayout) {
        // Update existing layout
        const { error } = await supabase
          .from('page_layouts')
          .update({ 
            layout_data: jsonLayoutData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLayout.id);
        
        if (error) throw error;
      } else {
        // Insert new layout
        const { error } = await supabase
          .from('page_layouts')
          .insert({ 
            page_id: 'home',
            layout_data: jsonLayoutData,
            is_published: false
          });
        
        if (error) throw error;
      }
      
      toast.success('Layout saved successfully');
    } catch (error) {
      console.error('Error saving layout:', error);
      toast.error('Failed to save layout');
    } finally {
      setIsLoading(false);
    }
  };

  // Get sections for the current template
  const currentTemplateSections = templates.find(t => t.id === selectedTemplate)?.sections || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Layout Template</h3>
          <p className="text-sm text-gray-500">Select a template to structure your page</p>
        </div>
        <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name} {template.isNew && <span className="ml-2 text-xs bg-[#ab233a] text-white px-1 py-0.5 rounded">NEW</span>}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Template preview */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h4 className="font-medium mb-2">Template Structure</h4>
        <div className="space-y-2">
          {currentTemplateSections.map((section) => (
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

      <div className="flex justify-end">
        <Button
          onClick={handleSaveLayout}
          disabled={isLoading}
          className="bg-[#ab233a] hover:bg-[#811a2c]"
        >
          {isLoading ? 'Saving...' : 'Save Layout'}
        </Button>
      </div>

      <div className="p-4 bg-gray-50 rounded-md border">
        <h4 className="text-base font-medium mb-2">Layout Editor Instructions</h4>
        <ol className="text-sm text-gray-500 list-decimal pl-5 space-y-1">
          <li>Select a template that best fits your page structure</li>
          <li>Drag components from the Component Library to add them to sections</li>
          <li>Arrange components within sections by dragging</li>
          <li>Save your layout when you're satisfied with the structure</li>
        </ol>
      </div>
    </div>
  );
};
