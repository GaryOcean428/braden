
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileVideo, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { MediaItem } from './types';

interface MediaItemDetailsProps {
  item: MediaItem;
  onDelete: (item: MediaItem) => Promise<void>;
}

export const MediaItemDetails: React.FC<MediaItemDetailsProps> = ({ item, onDelete }) => {
  if (!item) return null;
  
  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            {item.type.startsWith('image/') ? (
              <img
                src={item.publicUrl}
                alt={item.name}
                className="w-full rounded-md"
              />
            ) : (
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <FileVideo className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          <div className="md:w-2/3 space-y-4">
            <div>
              <Label>File Name</Label>
              <div className="text-lg font-medium">{item.name}</div>
            </div>
            <div>
              <Label>URL</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  value={item.publicUrl} 
                  readOnly 
                />
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(item.publicUrl);
                    toast.success("URL copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <div>{item.type}</div>
              </div>
              <div>
                <Label>Size</Label>
                <div>{Math.round(item.size / 1024)} KB</div>
              </div>
              <div>
                <Label>Date Added</Label>
                <div>{new Date(item.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="pt-4">
              <Button 
                variant="destructive"
                onClick={() => onDelete(item)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete File
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
