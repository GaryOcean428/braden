import React, { useState } from 'react';
import { Search } from 'lucide-react';
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
  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Handle bulk upload
      files.forEach(file => {
        onSelectItem({ id: file.name, name: file.name, publicUrl: URL.createObjectURL(file), size: file.size, type: file.type, created_at: new Date().toISOString() });
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            className="aspect-square bg-gray-200 rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  // No items state
  if (items.length === 0 && !searchQuery) {
    return (
      <div 
        className={`text-center py-16 border-2 border-dashed border-gray-300 rounded-md ${dragging ? 'bg-gray-100' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="text-gray-500 mb-2">No images found</p>
        <p className="text-sm text-gray-400">Upload images using the button above or drag and drop files here</p>
      </div>
    );
  }
  
  // No search results
  if (items.length === 0 && searchQuery) {
    return (
      <div 
        className={`text-center py-16 border-2 border-dashed border-gray-300 rounded-md ${dragging ? 'bg-gray-100' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
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
  
  // Display images
  return (
    <div 
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${dragging ? 'bg-gray-100' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {items.map(item => (
        <div 
          key={item.id}
          onClick={() => onSelectItem(item)}
          className={`
            aspect-square rounded-md overflow-hidden border cursor-pointer
            hover:shadow-md transition-all
            ${selectedItem?.id === item.id ? 'ring-2 ring-[#ab233a] ring-offset-2' : ''}
          `}
        >
          <img 
            src={item.publicUrl} 
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};
