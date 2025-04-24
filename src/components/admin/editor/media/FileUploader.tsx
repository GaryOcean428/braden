import React, { useState } from 'react';
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const totalFiles = files.length;
    let uploadedFiles = 0;

    for (const file of Array.from(files)) {
      await onChange({ target: { files: [file] } } as React.ChangeEvent<HTMLInputElement>);
      uploadedFiles += 1;
      setUploadProgress((uploadedFiles / totalFiles) * 100);
    }

    setUploadProgress(null);
  };

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
          {uploadProgress !== null && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept={accept}
            multiple
          />
        </>
      )}
    </Button>
  );
};
