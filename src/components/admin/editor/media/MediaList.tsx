
import React from 'react';
import { FileText, Search, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MediaItem } from './types';

interface MediaListProps {
  isLoading: boolean;
  items: MediaItem[];
  searchQuery: string;
  onDeleteItem: (item: MediaItem) => void;
  onClearSearch: () => void;
}

export const MediaList: React.FC<MediaListProps> = ({
  isLoading,
  items,
  searchQuery,
  onDeleteItem,
  onClearSearch
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className="h-16 bg-gray-200 rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  // No items state
  if (items.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-md">
        <p className="text-gray-500 mb-2">No media files found</p>
        <p className="text-sm text-gray-400">Upload files using the button above</p>
      </div>
    );
  }
  
  // No search results
  if (items.length === 0 && searchQuery) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-md">
        <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500 mb-2">No media files matching "{searchQuery}"</p>
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
    <div className="space-y-2">
      {items.map(item => (
        <div 
          key={item.id} 
          className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded">
              <FileText className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-sm truncate max-w-[200px]">{item.name}</p>
              <p className="text-xs text-gray-500">
                {formatFileSize(item.size)} • {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteItem(item);
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
