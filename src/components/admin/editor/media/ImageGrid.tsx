
import React from 'react';
import { Trash, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaItem } from './types';

interface ImageGridProps {
  isLoading: boolean;
  items: MediaItem[];
  searchQuery: string;
  selectedItem: MediaItem | null;
  onSelectItem: (item: MediaItem) => void;
  onDeleteItem: (item: MediaItem) => void;
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
  // Filter for only image types
  const imageItems = items.filter(item => 
    item.type.startsWith('image/') || 
    item.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|svg)$/)
  );
  
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div 
            key={i}
            className="aspect-square bg-gray-200 rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  // No items state
  if (imageItems.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-md">
        <p className="text-gray-500 mb-2">No images found</p>
        <p className="text-sm text-gray-400">Upload some images using the button above</p>
      </div>
    );
  }
  
  // No search results
  if (imageItems.length === 0 && searchQuery) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-md">
        <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500 mb-2">No images matching "{searchQuery}"</p>
        <button 
          onClick={onClearSearch}
          className="text-sm text-[#ab233a] hover:underline"
        >
          Clear search
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {imageItems.map((item) => (
        <div 
          key={item.id} 
          className={`
            relative aspect-square rounded-md border overflow-hidden cursor-pointer group
            ${selectedItem?.id === item.id ? 'ring-2 ring-[#ab233a]' : ''}
          `}
          onClick={() => onSelectItem(item)}
        >
          <img 
            src={item.publicUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Handle image load errors
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end p-2">
            <p className="text-white text-xs truncate w-full opacity-0 group-hover:opacity-100 transition-opacity">
              {item.name}
            </p>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-red-500 hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(item);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
