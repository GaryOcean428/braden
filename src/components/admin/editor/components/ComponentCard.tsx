import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Move } from 'lucide-react';
import { toast } from 'sonner';

export interface ComponentItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isNew?: boolean;
  usageCount?: number;
}

interface ComponentCardProps {
  component: ComponentItem;
  isDragging: boolean;
  onDragStart: (componentId: string) => void;
  onChange: () => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  isDragging,
  onDragStart,
  onChange,
}) => {
  const handleAddComponent = (componentId: string) => {
    onChange();
    toast.success(`Component "${componentId}" added to layout`, {
      description:
        'Drag components to specific layout sections in the Layout Editor',
    });
  };

  return (
    <Card
      key={component.id}
      className={`cursor-grab ${isDragging ? 'opacity-50' : ''}`}
      draggable
      onDragStart={() => onDragStart(component.id)}
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
          <AspectRatio
            ratio={16 / 9}
            className="bg-gray-100 rounded-md overflow-hidden"
          >
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
  );
};
