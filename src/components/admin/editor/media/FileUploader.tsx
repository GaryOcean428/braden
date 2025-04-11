
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

interface FileUploaderProps {
  uploading: boolean;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  uploading, 
  accept = 'image/*',
  onChange 
}) => {
  return (
    <Button
      variant="outline" 
      className="relative"
      disabled={uploading}
    >
      {uploading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2" />
          Upload File
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={onChange}
            accept={accept}
          />
        </>
      )}
    </Button>
  );
};
