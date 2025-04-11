
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileVideo, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { MediaItem } from './types';

interface MediaListProps {
  isLoading: boolean;
  items: MediaItem[];
  searchQuery: string;
  onDeleteItem: (item: MediaItem) => Promise<void>;
  onClearSearch: () => void;
}

export const MediaList: React.FC<MediaListProps> = ({
  isLoading,
  items,
  searchQuery,
  onDeleteItem,
  onClearSearch
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#ab233a]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 text-center border rounded-md">
        <FileVideo className="h-12 w-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">
          {searchQuery ? 'No media files match your search' : 'No media files found'}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={onClearSearch}
        >
          {searchQuery ? 'Clear Search' : 'Upload Media'}
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.type.startsWith('image/') ? (
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        src={item.publicUrl}
                        alt={item.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                      <FileVideo className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {item.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {item.type}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {Math.round(item.size / 1024)} KB
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex gap-2 justify-end">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(item.publicUrl);
                      toast.success("URL copied to clipboard");
                    }}
                  >
                    Copy URL
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => onDeleteItem(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
