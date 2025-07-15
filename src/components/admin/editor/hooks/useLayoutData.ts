import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/database.types';
import { LayoutSection } from '../components/TemplateSelector';

export interface LayoutData {
  template: string;
  sections: LayoutSection[];
  lastUpdated: string;
}

export const useLayoutData = (onChange: () => void) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [layoutData, setLayoutData] = useState<LayoutData>({
    template: 'standard',
    sections: [],
    lastUpdated: new Date().toISOString(),
  });

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
          if (error.code !== 'PGRST116') {
            // Not found error
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

  // Save the layout to the database
  const handleSaveLayout = async () => {
    try {
      setIsLoading(true);

      // Convert sections to a format that's compatible with Json type
      const jsonSections = layoutData.sections.map((section) => ({
        id: section.id,
        name: section.name,
        components: section.components || [],
      }));

      // Prepare layout data as Json compatible object
      const jsonLayoutData: Json = {
        template: layoutData.template,
        sections: jsonSections,
        lastUpdated: layoutData.lastUpdated,
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
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingLayout.id);

        if (error) throw error;
      } else {
        // Insert new layout
        const { error } = await supabase.from('page_layouts').insert({
          page_id: 'home',
          layout_data: jsonLayoutData,
          is_published: false,
        });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error saving layout:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Change the selected template
  const handleTemplateChange = (value: string, templates: any[]) => {
    const template = templates.find((t) => t.id === value);
    if (template) {
      setSelectedTemplate(value);

      // Update the layout data with the new template
      setLayoutData({
        template: value,
        sections: template.sections,
        lastUpdated: new Date().toISOString(),
      });

      onChange(); // Notify parent of change
    }
  };

  return {
    selectedTemplate,
    layoutData,
    isLoading,
    handleTemplateChange,
    handleSaveLayout,
  };
};
