
import React from 'react';
import { SiteEditorLayout } from '@/components/admin/editor/SiteEditorLayout';
import { useSiteEditor } from '@/hooks/useSiteEditor';
import { initializeStorageBuckets } from '@/integrations/supabase/storage';
import { toast } from 'sonner';

const SiteEditor: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    hasUnsavedChanges,
    handlePublish,
    handlePreview,
    handleChange
  } = useSiteEditor();
  
  // Initialize storage buckets when component mounts
  React.useEffect(() => {
    const init = async () => {
      try {
        await initializeStorageBuckets();
        console.log('Storage buckets initialized in SiteEditor');
      } catch (error) {
        console.error('Error initializing storage buckets:', error);
        toast.error("Storage Error", {
          description: "Could not initialize media storage. Some features may not work properly."
        });
      }
    };
    
    init();
  }, []);

  return (
    <SiteEditorLayout
      isLoading={isLoading}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      hasUnsavedChanges={hasUnsavedChanges}
      handlePublish={handlePublish}
      handlePreview={handlePreview}
      handleChange={handleChange}
    />
  );
};

export default SiteEditor;
