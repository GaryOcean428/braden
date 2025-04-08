
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  LayoutTemplate, 
  Type, 
  Image as ImageIcon, 
  MessageSquare, 
  FileText,
  Move,
  Plus 
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ComponentLibraryProps {
  onChange: () => void;
}

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  components: ComponentItem[];
}

interface ComponentItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isNew?: boolean;
  usageCount?: number;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onChange }) => {
  const [activeCategory, setActiveCategory] = useState('layouts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Component categories and items
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
          description: 'Equal width three-column layout',
          isNew: true
        },
        {
          id: 'sidebar-left',
          name: 'Sidebar Left',
          description: 'Layout with left sidebar and main content',
          usageCount: 3
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
          description: 'Section heading with multiple levels',
          usageCount: 12
        },
        {
          id: 'paragraph',
          name: 'Paragraph',
          description: 'Text paragraph with formatting options',
          usageCount: 8
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
        },
        {
          id: 'callout',
          name: 'Callout',
          description: 'Highlighted box with important information',
          isNew: true
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
          description: 'Single image with caption',
          usageCount: 5
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
        },
        {
          id: 'carousel',
          name: 'Carousel',
          description: 'Scrolling image or content carousel',
          isNew: true
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
          description: 'Customizable form with various field types',
          usageCount: 2
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
        },
        {
          id: 'testimonial',
          name: 'Testimonial',
          description: 'Customer testimonial with image and attribution',
          isNew: true
        }
      ]
    },
    {
      id: 'braden',
      name: 'Braden',
      icon: <FileText className="h-4 w-4" />,
      components: [
        {
          id: 'hero',
          name: 'Hero Section',
          description: 'Full width hero section with background image',
          usageCount: 1
        },
        {
          id: 'services',
          name: 'Services Grid',
          description: 'Display services in a responsive grid'
        },
        {
          id: 'about',
          name: 'About Section',
          description: 'Company profile section with image and text'
        },
        {
          id: 'contact',
          name: 'Contact Form',
          description: 'Styled contact form with validation'
        }
      ]
    }
  ];

  const handleAddComponent = (componentId: string) => {
    onChange();
    toast.success(`Component "${componentId}" added to layout`, {
      description: "Drag components to specific layout sections in the Layout Editor"
    });
  };
  
  const handleDragStart = (componentId: string) => {
    // In a full implementation, this would set data for the drag operation
    setIsDragging(true);
    // For now, we'll simulate the drag interaction
    setTimeout(() => setIsDragging(false), 1000);
  };
  
  const handleCreateCustomComponent = () => {
    toast.info("Creating custom component", {
      description: "Custom component creation will be available in Phase 2"
    });
  };
  
  // Filter components based on search term
  const filteredCategories = categories.map(category => {
    return {
      ...category,
      components: category.components.filter(component => 
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    };
  }).filter(category => category.components.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Component Library</h3>
        <Button 
          variant="outline" 
          onClick={handleCreateCustomComponent}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Create Custom Component
        </Button>
      </div>
      
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ab233a]"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 absolute left-3 top-[50%] transform -translate-y-1/2 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
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
        
        {filteredCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {category.components.map((component) => (
                <Card 
                  key={component.id} 
                  className={`cursor-grab ${isDragging ? 'opacity-50' : ''}`}
                  draggable 
                  onDragStart={() => handleDragStart(component.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base flex items-center gap-2">
                        {component.name}
                        {component.isNew && (
                          <Badge className="bg-[#ab233a] text-white text-xs">New</Badge>
                        )}
                      </CardTitle>
                      <Move className="h-4 w-4 text-gray-400" />
                    </div>
                    <CardDescription className="text-xs">
                      {component.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {component.imageUrl ? (
                      <AspectRatio ratio={16/9} className="bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={component.imageUrl}
                          alt={component.name}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    ) : (
                      <div className="bg-gray-100 rounded-md h-20 flex items-center justify-center">
                        <p className="text-xs text-gray-500">Component preview</p>
                      </div>
                    )}
                    
                    {component.usageCount && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Used {component.usageCount} times
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0">
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
            
            {category.components.length === 0 && searchTerm && (
              <div className="p-8 text-center bg-gray-50 rounded-md border">
                <p className="text-gray-500">No results found for "{searchTerm}" in {category.name}</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="p-4 bg-gray-50 rounded-md border">
        <h4 className="text-base font-medium mb-2">Using Components</h4>
        <ol className="text-sm text-gray-500 list-decimal pl-5 space-y-1">
          <li>Drag a component from the library to your layout in the Layout Editor</li>
          <li>Configure component properties in the properties panel</li>
          <li>Save changes to update the live site</li>
        </ol>
      </div>
    </div>
  );
};
