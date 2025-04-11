
import React from "react";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "./MediaUploader";
import { MediaGallery } from "./MediaGallery";
import { useMediaManager } from "./useMediaManager";

const MediaManagerCard = () => {
  const { 
    loading, 
    images, 
    error, 
    uploading, 
    loadImages,
    handleFileUpload,
    deleteImage
  } = useMediaManager();

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden border-0">
      <CardHeader className="bg-[#2c3e50] text-white">
        <CardTitle className="flex justify-between items-center">
          <span>Media Library</span>
          <Button
            onClick={loadImages}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-[#34495e]"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <MediaUploader 
          uploading={uploading} 
          onFileUpload={handleFileUpload} 
          error={error}
        />

        <MediaGallery 
          loading={loading}
          images={images}
          onDeleteImage={deleteImage}
        />
      </CardContent>
    </Card>
  );
};

export default MediaManagerCard;
