import React from 'react';
import { formatDistance } from 'date-fns';
import { Trash2, Calendar, FileType, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaItem } from './types';
import { formatFileSize } from '@/utils/formatFileSize';

interface MediaItemDetailsProps {
  item: MediaItem;
  onDelete: (item: MediaItem) => void;
}

export const MediaItemDetails: React.FC<MediaItemDetailsProps> = ({
  item,
  onDelete,
}) => {
  return (
    <div className="border rounded-lg p-4 mt-4">
      <h3 className="text-lg font-medium mb-4">Media Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="border rounded-md p-4 bg-gray-50 mb-4 flex justify-center">
            {item.type.startsWith('image/') ? (
              <img
                src={item.publicUrl}
                alt={item.name}
                className="max-h-48 object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <FileType className="h-16 w-16 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">{item.type}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => onDelete(item)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete Media
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1 text-gray-700">
              File Name
            </h4>
            <p className="text-sm break-all">{item.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1 text-gray-700">
              Direct URL
            </h4>
            <div className="flex items-center">
              <input
                type="text"
                value={item.publicUrl}
                readOnly
                className="text-sm p-2 border rounded-md w-full bg-gray-50"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => {
                  navigator.clipboard.writeText(item.publicUrl);
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1 text-gray-700">
                <FileType className="h-4 w-4" />
                Type
              </h4>
              <p className="text-sm">{item.type}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1 text-gray-700">
                <HardDrive className="h-4 w-4" />
                Size
              </h4>
              <p className="text-sm">{formatFileSize(item.size)}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1 text-gray-700">
                <Calendar className="h-4 w-4" />
                Uploaded
              </h4>
              <p className="text-sm">
                {formatDistance(new Date(item.created_at), new Date(), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
