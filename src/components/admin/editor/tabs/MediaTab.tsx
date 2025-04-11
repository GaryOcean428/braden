
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MediaLibrary } from '@/components/admin/editor/MediaLibrary';
import { FileImage, Upload } from 'lucide-react';

interface MediaTabProps {
  onChange: () => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({ onChange }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-[#ab233a] text-white">
        <div className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          <CardTitle>Media Library</CardTitle>
        </div>
        <CardDescription className="text-gray-100">
          Manage images, videos, and other media for your website
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 text-sm text-[#2c3e50]">
          <p>Upload and organize your media files. Supported formats include images (JPG, PNG, GIF, WebP), 
          videos (MP4, WebM), and documents (PDF).</p>
          <div className="flex items-center gap-2 mt-2 text-[#ab233a]">
            <Upload className="h-4 w-4" />
            <span className="font-medium">Drag and drop files or use the upload button below</span>
          </div>
        </div>
        <MediaLibrary onChange={onChange} />
      </CardContent>
    </Card>
  );
};
