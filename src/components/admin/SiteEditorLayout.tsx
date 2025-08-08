import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Layout, Layers, Image, File, FileText, Image as ImageIcon } from 'lucide-react';
import { SiteEditorHeader } from '@/components/admin/editor/SiteEditorHeader';
import { SiteEditorLoading } from '@/components/admin/editor/SiteEditorLoading';
import { ThemeTab } from '@/components/admin/editor/tabs/ThemeTab';
import { LayoutTab } from '@/components/admin/editor/tabs/LayoutTab';
import { ComponentsTab } from '@/components/admin/editor/tabs/ComponentsTab';
import { MediaTab } from '@/components/admin/editor/tabs/MediaTab';
import { LogosTab } from '@/components/admin/editor/tabs/LogosTab';
import { FaviconsTab } from '@/components/admin/editor/tabs/FaviconsTab';
import { PagesTab } from '@/components/admin/editor/tabs/PagesTab';
import { HeroTab } from '@/components/admin/editor/tabs/HeroTab';

interface SiteEditorLayoutProps {
  isLoading: boolean;
  isAdmin: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasUnsavedChanges: boolean;
  handlePublish: () => void;
  handlePreview: () => void;
  handleChange: () => void;
}

export const SiteEditorLayout: React.FC<SiteEditorLayoutProps> = ({
  isLoading,
  isAdmin,
  activeTab,
  setActiveTab,
  hasUnsavedChanges,
  handlePublish,
  handlePreview,
  handleChange,
}) => {
  if (isLoading) {
    return <SiteEditorLoading />;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="card">
          <div className="card-content pt-6 text-center">
            <p className="text-lg text-gray-500">
              Access denied. You don't have permission to use the site editor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SiteEditorHeader
        hasUnsavedChanges={hasUnsavedChanges}
        onPreview={handlePreview}
        onPublish={handlePublish}
      />

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
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
          <TabsTrigger value="favicons" className="flex items-center gap-1">
            <File className="h-4 w-4" />
            Favicons
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            Hero
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
        <TabsContent value="pages">
          <PagesTab onChange={handleChange} />
        </TabsContent>
        <TabsContent value="hero">
          <HeroTab onChange={handleChange} />
        </TabsContent>

        <TabsContent value="logos">
          <LogosTab onChange={handleChange} />
        </TabsContent>

        <TabsContent value="favicons">
          <FaviconsTab onChange={handleChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
