import React, { useState } from "react";
import { Upload, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface MediaUploaderProps {
  uploading: boolean;
  error: string | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  uploading,
  error,
  onFileUpload
}) => {
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileError("No file selected");
      return;
    }

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setFileError("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
      return;
    }

    if (file.size > maxSize) {
      setFileError("File size exceeds the 5MB limit.");
      return;
    }

    setFileError(null);
    await onFileUpload(event);
  };

  return (
    <div className="mb-6 p-6 border-2 border-dashed border-[#95a5a6] rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
      <Upload className="h-12 w-12 text-[#ab233a] mb-4" />
      <p className="text-sm text-[#2c3e50] mb-4 text-center">
        Drag and drop an image, or click to select
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-[#2c3e50] file:mr-4 file:py-2 file:px-4 
                 file:rounded-lg file:border-0 file:text-white file:bg-[#ab233a] hover:file:bg-[#811a2c]
                 cursor-pointer focus:outline-none"
        disabled={uploading}
      />
      {uploading && (
        <div className="mt-4 flex items-center text-[#95a5a6]">
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          <span>Uploading...</span>
        </div>
      )}
      {(error || fileError) && (
        <p className="mt-4 text-sm text-[#ab233a]">{error || fileError}</p>
      )}
    </div>
  );
};
