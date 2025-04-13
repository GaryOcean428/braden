
import React from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, Upload } from 'lucide-react';

interface ImageUploaderProps {
  uploading: boolean;
  error: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  uploading,
  error,
  onFileChange
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
      <Upload className="h-12 w-12 text-gray-400 mb-4" />
      <p className="text-sm text-gray-500 mb-4">
        Drag and drop an image, or click to select
      </p>
      <Input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={uploading}
        className="max-w-xs"
      />
      {uploading && (
        <div className="mt-4 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Uploading...</span>
        </div>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-500">
          Error: {error}
        </p>
      )}
    </div>
  );
};
