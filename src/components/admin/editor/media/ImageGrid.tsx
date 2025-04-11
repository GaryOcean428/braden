
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileImage, Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { MediaItem } from './types';

interface ImageGridProps {
  isLoading: boolean;
  items: MediaItem[];
  searchQuery: string;
  selectedItem: MediaItem | null;
  onSelectItem: (item: MediaItem) => void;
  onDeleteItem: (item: MediaItem) => Promise<void>;
  onClearSearch: () => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  isLoading,
  items,
  searchQuery,
  selectedItem,
  onSelectItem,
  onDeleteItem,
  onClearSearch
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-0 aspect-square bg-gray-100 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="col-span-4 p-8 text-center">
        <FileImage className="h-12 w-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">
          {searchQuery ? 'No images match your search' : 'No images found'}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={onClearSearch}
        >
          {searchQuery ? 'Clear Search' : 'Upload an Image'}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <Card 
          key={item.id}
          className={`overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-2 ${
            selectedItem?.id === item.id 
              ? 'ring-2 ring-[#ab233a] ring-offset-2' 
              : ''
          }`}
          onClick={() => onSelectItem(item)}
        >
          <CardContent className="p-0 relative">
            <div className="aspect-square">
              <img
                src={item.publicUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(item.publicUrl);
                    toast.success("URL copied to clipboard");
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
