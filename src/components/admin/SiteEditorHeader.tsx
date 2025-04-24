import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Save, Upload } from 'lucide-react';

interface SiteEditorHeaderProps {
  hasUnsavedChanges: boolean;
  onPreview: () => void;
  onPublish: () => void;
  onUploadLogo: () => void;
  onUploadFavicon: () => void;
}

export const SiteEditorHeader: React.FC<SiteEditorHeaderProps> = ({
  hasUnsavedChanges,
  onPreview,
  onPublish,
  onUploadLogo,
  onUploadFavicon
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[#ab233a]">Site Editor</h1>
        <p className="text-[#2c3e50] mt-1">
          Visually customize your website appearance and content
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={onPreview} 
          variant="outline"
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        
        <Button 
          onClick={onPublish}
          disabled={!hasUnsavedChanges}
          className="flex items-center gap-1 bg-[#ab233a] hover:bg-[#811a2c]"
        >
          <Save className="h-4 w-4" />
          Publish Changes
        </Button>

        <Button 
          onClick={onUploadLogo}
          variant="outline"
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          Upload Logo
        </Button>

        <Button 
          onClick={onUploadFavicon}
          variant="outline"
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          Upload Favicon
        </Button>
      </div>
    </div>
  );
};
