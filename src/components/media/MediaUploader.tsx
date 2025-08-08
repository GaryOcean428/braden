import React, { useState } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { NotificationService } from '@/utils/notificationService';

interface MediaUploaderProps {
  uploading: boolean;
  error: string | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  bucketName?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  uploading,
  error,
  onFileUpload,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSize = 10 * 1024 * 1024, // 10MB default
  bucketName = 'media',
}) => {
  const [fileError, setFileError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      const typeList = acceptedTypes
        .map((type) => type.split('/')[1].toUpperCase())
        .join(', ');
      return `Invalid file type. Only ${typeList} files are allowed.`;
    }

    // Check file size
    if (file.size > maxSize) {
      const sizeMB = Math.round(maxSize / (1024 * 1024));
      return `File size exceeds the ${sizeMB}MB limit. Current size: ${Math.round(file.size / (1024 * 1024))}MB`;
    }

    // Check file name
    if (file.name.length > 100) {
      return 'File name is too long. Please rename the file to be under 100 characters.';
    }

    // Check for valid characters in filename
    const validFilenameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!validFilenameRegex.test(file.name.replace(/\.[^/.]+$/, ''))) {
      return 'File name contains invalid characters. Please use only letters, numbers, dots, hyphens, and underscores.';
    }

    return null;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileError('No file selected');
      return;
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      NotificationService.validationError(['file']);
      return;
    }

    setFileError(null);

    try {
      await onFileUpload(event);
      NotificationService.success('File uploaded successfully', {
        description: `${file.name} has been uploaded to ${bucketName}`,
      });
    } catch (uploadError) {
      const errorMessage =
        uploadError instanceof Error ? uploadError.message : 'Upload failed';
      setFileError(errorMessage);
      NotificationService.error('Upload failed', {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="mb-6 p-6 border-2 border-dashed border-braden-slate rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
      <Upload className="h-12 w-12 text-braden-red mb-4" />
      <p className="text-sm text-braden-navy mb-4 text-center">
        Drag and drop an image, or click to select
      </p>
      <input
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
        className="block w-full text-sm text-braden-navy file:mr-4 file:py-2 file:px-4 
                 file:rounded-lg file:border-0 file:text-white file:bg-braden-red hover:file:bg-braden-dark-red
                 cursor-pointer focus:outline-none transition-default"
        disabled={uploading}
      />
      {uploading && (
        <div className="mt-4 flex items-center text-braden-slate">
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          <span>Uploading...</span>
        </div>
      )}
      {(error || fileError) && (
        <p className="mt-4 text-sm text-braden-red bg-red-50 p-2 rounded border border-red-200">
          {error || fileError}
        </p>
      )}
      <div className="mt-2 text-xs text-gray-500 text-center">
        <p>Max size: {Math.round(maxSize / (1024 * 1024))}MB</p>
        <p>
          Accepted:{' '}
          {acceptedTypes
            .map((type) => type.split('/')[1].toUpperCase())
            .join(', ')}
        </p>
      </div>
    </div>
  );
};
