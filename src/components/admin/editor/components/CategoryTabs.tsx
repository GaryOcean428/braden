import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { ComponentCard, ComponentItem } from './ComponentCard';
import { EmptyResults } from './EmptyResults';

export interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  components: ComponentItem[];
}

interface CategoryTabsProps {
  categories: ComponentCategory[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchTerm: string;
  isDragging: boolean;
  onDragStart: (componentId: string) => void;
  onChange: () => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  searchTerm,
  isDragging,
  onDragStart,
  onChange,
}) => {
  // Filter components based on search term
  const filteredCategories = categories
    .map((category) => {
      return {
        ...category,
        components: category.components.filter(
          (component) =>
            component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        ),
      };
    })
    .filter((category) => category.components.length > 0);

  return (
    <Tabs value={activeCategory} onValueChange={setActiveCategory}>
      <TabsList className="bg-gray-100">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="flex items-center gap-1"
          >
            {category.icon}
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {filteredCategories.map((category) => (
        <TabsContent key={category.id} value={category.id}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {category.components.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                isDragging={isDragging}
                onDragStart={onDragStart}
                onChange={onChange}
              />
            ))}
          </div>

          {category.components.length === 0 && searchTerm && (
            <EmptyResults
              searchTerm={searchTerm}
              categoryName={category.name}
            />
          )}
        </TabsContent>
      ))}

      {filteredCategories.length === 0 && searchTerm && (
        <div className="p-8 text-center bg-gray-50 rounded-md border mt-4">
          <p className="text-gray-500">
            No results found for "{searchTerm}" in any category
          </p>
        </div>
      )}
    </Tabs>
  );
};
