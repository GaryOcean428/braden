
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  PanelLeft, 
  PanelRight, 
  MoveHorizontal, 
  MousePointer, 
  Grid3X3, 
  Columns, 
  LayoutGrid,
  Save
} from 'lucide-react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface LayoutEditorProps {
  onChange: () => void;
}

interface LayoutTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  columns: number;
  description: string;
}

interface Section {
  id: string;
  type: string;
  name: string;
  columns?: number;
  width?: string;
  children?: Section[];
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({ onChange }) => {
  const [mode, setMode] = useState<'select' | 'move'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [layoutSections, setLayoutSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);

  const templates: LayoutTemplate[] = [
    {
      id: 'single-column',
      name: 'Single Column',
      icon: <PanelLeft className="h-5 w-5" />,
      columns: 1,
      description: 'Full width layout with one column'
    },
    {
      id: 'two-column',
      name: 'Two Column',
      icon: <Columns className="h-5 w-5" />,
      columns: 2,
      description: 'Equal width two-column layout'
    },
    {
      id: 'three-column',
      name: 'Three Column',
      icon: <Grid3X3 className="h-5 w-5" />,
      columns: 3,
      description: 'Equal width three-column layout'
    },
    {
      id: 'sidebar-left',
      name: 'Left Sidebar',
      icon: <PanelLeft className="h-5 w-5" />,
      columns: 2,
      description: 'Layout with left sidebar and main content'
    },
    {
      id: 'sidebar-right',
      name: 'Right Sidebar',
      icon: <PanelRight className="h-5 w-5" />,
      columns: 2,
      description: 'Layout with right sidebar and main content'
    },
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(templateId);
    
    if (template) {
      // Create a basic layout structure based on the template
      let newSections: Section[] = [];
      
      if (template.id === 'single-column') {
        newSections = [
          {
            id: `section-${Date.now()}`,
            type: 'container',
            name: 'Full Width Section',
            width: '100%'
          }
        ];
      } else if (template.id === 'two-column') {
        newSections = [
          {
            id: `section-${Date.now()}`,
            type: 'row',
            name: 'Two Column Row',
            columns: 2,
            children: [
              {
                id: `column-1-${Date.now()}`,
                type: 'column',
                name: 'Left Column',
                width: '50%'
              },
              {
                id: `column-2-${Date.now()}`,
                type: 'column',
                name: 'Right Column',
                width: '50%'
              }
            ]
          }
        ];
      } else if (template.id === 'three-column') {
        newSections = [
          {
            id: `section-${Date.now()}`,
            type: 'row',
            name: 'Three Column Row',
            columns: 3,
            children: [
              {
                id: `column-1-${Date.now()}`,
                type: 'column',
                name: 'Left Column',
                width: '33.33%'
              },
              {
                id: `column-2-${Date.now()}`,
                type: 'column',
                name: 'Middle Column',
                width: '33.33%'
              },
              {
                id: `column-3-${Date.now()}`,
                type: 'column',
                name: 'Right Column',
                width: '33.33%'
              }
            ]
          }
        ];
      } else if (template.id === 'sidebar-left') {
        newSections = [
          {
            id: `section-${Date.now()}`,
            type: 'row',
            name: 'Sidebar Left Layout',
            columns: 2,
            children: [
              {
                id: `column-1-${Date.now()}`,
                type: 'column',
                name: 'Sidebar',
                width: '25%'
              },
              {
                id: `column-2-${Date.now()}`,
                type: 'column',
                name: 'Main Content',
                width: '75%'
              }
            ]
          }
        ];
      } else if (template.id === 'sidebar-right') {
        newSections = [
          {
            id: `section-${Date.now()}`,
            type: 'row',
            name: 'Sidebar Right Layout',
            columns: 2,
            children: [
              {
                id: `column-1-${Date.now()}`,
                type: 'column',
                name: 'Main Content',
                width: '75%'
              },
              {
                id: `column-2-${Date.now()}`,
                type: 'column',
                name: 'Sidebar',
                width: '25%'
              }
            ]
          }
        ];
      }
      
      setLayoutSections(newSections);
      toast.success(`Template "${template.name}" applied`);
      onChange();
    }
  };

  const handleSaveLayout = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }
    
    try {
      setSaving(true);
      
      // Create a layout data object to store
      const layoutData = {
        template: selectedTemplate,
        sections: layoutSections,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to database
      const { error } = await supabase
        .from('page_layouts')
        .insert({
          page_id: 'home', // Default to home page for now
          layout_data: layoutData,
          is_published: false,
        });
        
      if (error) {
        throw error;
      }
      
      toast.success('Layout saved successfully');
      onChange();
    } catch (error) {
      console.error('Error saving layout:', error);
      toast.error('Failed to save layout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Layout Editor</h3>
        <div className="flex items-center gap-2">
          <div className="border rounded-md p-1 flex items-center">
            <Button
              variant={mode === 'select' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setMode('select')}
              className="flex items-center gap-1 h-8"
            >
              <MousePointer className="h-4 w-4" />
              Select
            </Button>
            <Button 
              variant={mode === 'move' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setMode('move')}
              className="flex items-center gap-1 h-8"
            >
              <MoveHorizontal className="h-4 w-4" />
              Move
            </Button>
          </div>
          
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleSaveLayout}
            disabled={saving || !selectedTemplate}
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Layout'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Template Selection Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Layout Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className={`
                    p-3 rounded-md cursor-pointer flex items-center gap-3
                    ${selectedTemplate === template.id 
                      ? 'bg-[#f0f0f0] border border-[#ab233a]' 
                      : 'hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="bg-gray-100 p-2 rounded-md">
                    {template.icon}
                  </div>
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Layout Preview Area */}
        <div className="md:col-span-3 border-2 border-dashed rounded-md bg-gray-50 p-4">
          {!selectedTemplate ? (
            <div className="text-center py-10">
              <LayoutGrid className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">Select a Layout Template</h3>
              <p className="text-gray-500">
                Choose a template from the sidebar to start designing your page layout
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Layout Preview</h3>
                <Badge variant="outline">
                  {templates.find(t => t.id === selectedTemplate)?.name || 'Custom Layout'}
                </Badge>
              </div>
              
              {/* Layout Preview */}
              <div className="bg-white border rounded-md min-h-[400px] p-2">
                {layoutSections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-md p-2 mb-4">
                    <div className="text-xs text-gray-500 mb-2">{section.name}</div>
                    
                    {section.children ? (
                      <ResizablePanelGroup direction="horizontal" className="min-h-[200px]">
                        {section.children.map((column, index) => (
                          <React.Fragment key={column.id}>
                            <ResizablePanel defaultSize={100 / section.children!.length}>
                              <div className="border border-dashed border-gray-300 rounded-md p-4 h-full flex items-center justify-center">
                                <p className="text-sm text-gray-400">{column.name}</p>
                              </div>
                            </ResizablePanel>
                            
                            {index < section.children.length - 1 && (
                              <ResizableHandle withHandle />
                            )}
                          </React.Fragment>
                        ))}
                      </ResizablePanelGroup>
                    ) : (
                      <div className="border border-dashed border-gray-300 rounded-md p-8 h-full flex items-center justify-center">
                        <p className="text-sm text-gray-400">{section.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Drag components from the Component Library to populate your layout sections</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md border text-center">
        <p className="text-sm text-gray-500">
          <strong>Note:</strong> Full drag-and-drop editor will be implemented in the next phase. This is a basic implementation to demonstrate functionality.
        </p>
      </div>
    </div>
  );
};
