
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LayoutTemplate, Type, Image as ImageIcon, MessageSquare, FileText } from 'lucide-react';

interface ComponentLibraryProps {
  onChange: () => void;
}

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  components: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
  }[];
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onChange }) => {
  const [activeCategory, setActiveCategory] = useState('layouts');

  // Placeholder component categories and items
  const categories: ComponentCategory[] = [
    {
      id: 'layouts',
      name: 'Layouts',
      icon: <LayoutTemplate className="h-4 w-4" />,
      components: [
        {
          id: 'single-column',
          name: 'Single Column',
          description: 'Full width single column layout'
        },
        {
          id: 'two-column',
          name: 'Two Columns',
          description: 'Equal width two-column layout'
        },
        {
          id: 'three-column',
          name: 'Three Columns',
          description: 'Equal width three-column layout'
        },
        {
          id: 'sidebar-left',
          name: 'Sidebar Left',
          description: 'Layout with left sidebar and main content'
        },
        {
          id: 'sidebar-right',
          name: 'Sidebar Right',
          description: 'Layout with right sidebar and main content'
        }
      ]
    },
    {
      id: 'content',
      name: 'Content',
      icon: <Type className="h-4 w-4" />,
      components: [
        {
          id: 'heading',
          name: 'Heading',
          description: 'Section heading with multiple levels'
        },
        {
          id: 'paragraph',
          name: 'Paragraph',
          description: 'Text paragraph with formatting options'
        },
        {
          id: 'list',
          name: 'List',
          description: 'Ordered or unordered list'
        },
        {
          id: 'quote',
          name: 'Quote',
          description: 'Formatted blockquote with attribution'
        }
      ]
    },
    {
      id: 'media',
      name: 'Media',
      icon: <ImageIcon className="h-4 w-4" />,
      components: [
        {
          id: 'image',
          name: 'Image',
          description: 'Single image with caption'
        },
        {
          id: 'gallery',
          name: 'Gallery',
          description: 'Image gallery with multiple layouts'
        },
        {
          id: 'video',
          name: 'Video',
          description: 'Embedded video player'
        }
      ]
    },
    {
      id: 'interactive',
      name: 'Interactive',
      icon: <MessageSquare className="h-4 w-4" />,
      components: [
        {
          id: 'form',
          name: 'Form',
          description: 'Customizable form with various field types'
        },
        {
          id: 'cta',
          name: 'Call to Action',
          description: 'Highlighted call-to-action button or section'
        },
        {
          id: 'accordion',
          name: 'Accordion',
          description: 'Collapsible content sections'
        },
        {
          id: 'tabs',
          name: 'Tabs',
          description: 'Tabbed content interface'
        }
      ]
    }
  ];

  const handleAddComponent = (componentId: string) => {
    // This is a placeholder function for Phase 2
    onChange();
    toast.success(`Component "${componentId}" added to layout`, {
      description: "Full component functionality will be available in Phase 2"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Component Library</h3>
        <Button variant="outline" onClick={() => toast.info("Custom component creation will be available in Phase 2")}>
          <FileText className="h-4 w-4 mr-2" />
          Create Custom Component
        </Button>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="bg-gray-100">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
              {category.icon}
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {category.components.map((component) => (
                <Card key={component.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{component.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{component.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddComponent(component.id)}
                    >
                      Add to Layout
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="p-4 bg-gray-50 rounded-md border text-center">
        <p className="text-sm text-gray-500">
          Drag and drop functionality for components will be implemented in Phase 2.
        </p>
      </div>
    </div>
  );
};
