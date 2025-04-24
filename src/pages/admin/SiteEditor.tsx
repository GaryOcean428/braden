
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeadsCard from '@/components/admin/SiteEditor/LeadsCard';
import ClientsCard from '@/components/admin/SiteEditor/ClientsCard';
import StaffCard from '@/components/admin/SiteEditor/StaffCard';
import TasksCard from '@/components/admin/SiteEditor/TasksCard';
import EmailsCard from '@/components/admin/SiteEditor/EmailsCard';
import { useSiteEditorData } from '@/hooks/admin/useSiteEditorData';
import { LogoManager } from '@/components/admin/editor/media/LogoManager';
import { SiteEditorLayout } from '@/components/admin/editor/SiteEditorLayout';
import { useSiteEditor } from '@/hooks/useSiteEditor';
import { initializeStorageBuckets } from '@/integrations/supabase/storage';
import { MediaTab } from '@/components/admin/editor/tabs/MediaTab';
import { toast } from 'sonner';

const SiteEditor: React.FC = () => {
  const navigate = useNavigate();
  const [currentLogo, setCurrentLogo] = useState<string | undefined>(undefined);
  const [currentFavicon, setCurrentFavicon] = useState<string | undefined>(undefined);
  
  const {
    loading,
    leads,
    clients,
    staff,
    tasks,
    emails,
    handleAddLead,
    handleAddClient,
    handleAddStaff,
    handleAddTask,
    handleAddEmail,
  } = useSiteEditorData();
  
  const {
    activeTab,
    setActiveTab,
    isLoading: siteEditorLoading,
    isAdmin,
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
        console.log('Storage buckets initialized');
      } catch (error) {
        console.error('Error initializing storage buckets:', error);
      }
    };
    
    init();
  }, []);

  const handleLogoUpdate = (logoUrl: string) => {
    setCurrentLogo(logoUrl);
    handleChange(); // Mark as having unsaved changes
    toast.success("Logo updated! Remember to publish your changes.");
  };
  
  const handleFaviconUpdate = (faviconUrl: string) => {
    setCurrentFavicon(faviconUrl);
    handleChange(); // Mark as having unsaved changes
    toast.success("Favicon updated! Remember to publish your changes.");
  };

  // If using the SiteEditorLayout
  if (isAdmin) {
    return (
      <SiteEditorLayout
        isLoading={siteEditorLoading}
        isAdmin={isAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasUnsavedChanges={hasUnsavedChanges}
        handlePublish={handlePublish}
        handlePreview={handlePreview}
        handleChange={handleChange}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Site Editor</h1>
        <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
      </div>
      
      <Tabs defaultValue="content" className="mb-6">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeadsCard leads={leads} onAddLead={handleAddLead} />
            <ClientsCard clients={clients} onAddClient={handleAddClient} />
            <StaffCard staff={staff} onAddStaff={handleAddStaff} />
            <TasksCard tasks={tasks} onAddTask={handleAddTask} />
            <EmailsCard emails={emails} onAddEmail={handleAddEmail} />
          </div>
        </TabsContent>
        
        <TabsContent value="branding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LogoManager 
              onLogoUpdate={handleLogoUpdate}
              currentLogo={currentLogo}
              bucketName="logos"
            />
            
            <LogoManager 
              onLogoUpdate={handleFaviconUpdate}
              currentLogo={currentFavicon}
              title="Favicon Manager"
              description="Update your site favicon"
              bucketName="favicons"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="media">
          <MediaTab onChange={handleChange} />
        </TabsContent>
      </Tabs>
      
      {loading && (
        <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ab233a]" />
        </div>
      )}
    </div>
  );
};

export default SiteEditor;
