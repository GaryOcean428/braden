import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Eye, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SiteEditorHeaderProps {
  hasUnsavedChanges: boolean;
  onPreview: () => void;
  onPublish: () => void;
}

export const SiteEditorHeader: React.FC<SiteEditorHeaderProps> = ({
  hasUnsavedChanges,
  onPreview,
  onPublish
}) => {
  const navigate = useNavigate();
  
  const handleBackToDashboard = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave? Your changes may be lost."
      );
      if (!confirmed) return;
    }
    navigate('/admin/dashboard');
  };

  const handlePreview = () => {
    onPreview();
    toast.success("Opening preview in new tab");
  };

  const handlePublish = async () => {
    try {
      await onPublish();
      toast.success("Changes published successfully");
    } catch (error) {
      toast.error("Failed to publish changes");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1 text-braden-navy hover:text-braden-red"
            onClick={handleBackToDashboard}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-braden-red">Site Editor</h1>
        <p className="text-braden-navy mt-1">
          Customize your website appearance and content
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={handlePreview} 
          variant="outline"
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        
        <Button 
          onClick={handlePublish}
          disabled={!hasUnsavedChanges}
          className="flex items-center gap-1 bg-braden-red hover:bg-braden-dark-red"
        >
          <Save className="h-4 w-4" />
          Publish Changes
        </Button>
      </div>
    </div>
  );
};
