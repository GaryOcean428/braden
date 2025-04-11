
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MediaItem as MediaItemType } from "./types";

interface MediaItemProps {
  image: MediaItemType;
  onDeleteImage: (id: string, filePath: string) => Promise<void>;
}

export const MediaItem: React.FC<MediaItemProps> = ({ image, onDeleteImage }) => {
  return (
    <div className="relative group rounded-lg overflow-hidden border border-gray-200">
      <img
        src={`${supabase.storage.from('media').getPublicUrl(image.file_path).data.publicUrl}`}
        alt={image.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2c3e50]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
        <span className="text-white text-sm truncate max-w-[80%]">{image.title}</span>
        <Button
          onClick={() => onDeleteImage(image.id, image.file_path)}
          variant="destructive"
          size="icon"
          className="bg-[#ab233a] hover:bg-[#811a2c] h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
