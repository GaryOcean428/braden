import React from 'react';
import { SiteEditorLayout } from '@/components/admin/SiteEditorLayout';
import { useSiteEditor } from '@/hooks/useSiteEditor';

const SiteEditor: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    isAdmin,
    hasUnsavedChanges,
    handlePublish,
    handlePreview,
    handleChange,
  } = useSiteEditor();

  return (
    <SiteEditorLayout
      isLoading={isLoading}
      isAdmin={isAdmin}
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
