import React from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageUploaderProps {
  uploading: boolean;
  error: Error | string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  uploading,
  error,
  onFileChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      onFileChange(e);
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
      <Upload className="h-12 w-12 text-gray-400 mb-4" />
      <p className="text-sm text-gray-500 mb-4">
        Drag and drop an image, or click to select
      </p>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="max-w-xs cursor-pointer file:cursor-pointer"
      />
      {uploading && (
        <div className="mt-4 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Uploading...</span>
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
