
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Layout, Layers, Image, File } from 'lucide-react';
import { SiteEditorHeader } from '@/components/admin/editor/SiteEditorHeader';
import { SiteEditorLoading } from '@/components/admin/editor/SiteEditorLoading';
import { ThemeTab } from '@/components/admin/editor/tabs/ThemeTab';
import { LayoutTab } from '@/components/admin/editor/tabs/LayoutTab';
import { ComponentsTab } from '@/components/admin/editor/tabs/ComponentsTab';
import { MediaTab } from '@/components/admin/editor/tabs/MediaTab';
import { LogoTab } from '@/components/admin/editor/tabs/LogoTab';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { Navigate } from 'react-router-dom';

interface SiteEditorLayoutProps {
  isLoading: boolean;
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  hasUnsavedChanges: boolean;
  handlePublish: () => void;
  handlePreview: () => void;
  handleChange: () => void;
}

export const SiteEditorLayout: React.FC<SiteEditorLayoutProps> = ({
  isLoading,
  activeTab,
  setActiveTab,
  hasUnsavedChanges,
  handlePublish,
  handlePreview,
  handleChange
}) => {
  const { isAdmin, loading: permissionLoading, error } = useAdminPermissions();

  if (isLoading || permissionLoading) {
    return <SiteEditorLoading />;
  }

  if (!isAdmin || error) {
    return <Navigate to="/admin/auth" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SiteEditorHeader 
        hasUnsavedChanges={hasUnsavedChanges}
        onPreview={handlePreview}
        onPublish={handlePublish}
      />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-100 border">
          <TabsTrigger value="theme" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-1">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            Components
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-1">
            <Image className="h-4 w-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="logos" className="flex items-center gap-1">
            <File className="h-4 w-4" />
            Logos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme">
          <ThemeTab onChange={handleChange} />
        </TabsContent>

        <TabsContent value="layout">
          <LayoutTab onChange={handleChange} />
        </TabsContent>

        <TabsContent value="components">
          <ComponentsTab onChange={handleChange} />
        </TabsContent>

        <TabsContent value="media">
          <MediaTab onChange={handleChange} />
        </TabsContent>

        <TabsContent value="logos">
          <LogoTab onChange={handleChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
