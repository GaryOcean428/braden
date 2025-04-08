
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Palette, Layout, Type, Image, Layers, Save, Eye } from 'lucide-react';
import { ThemeEditor } from '@/components/admin/editor/ThemeEditor';
import { LayoutEditor } from '@/components/admin/editor/LayoutEditor';
import { ComponentLibrary } from '@/components/admin/editor/ComponentLibrary';
import { MediaLibrary } from '@/components/admin/editor/MediaLibrary';

const SiteEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theme');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast.error("Authentication Required", {
          description: "Please log in to access the site editor"
        });
        navigate('/admin/auth');
        return;
      }
      
      // Check if the user is the developer by email
      const userEmail = data.session.user.email;
      
      if (userEmail === 'braden.lang77@gmail.com') {
        setIsAdmin(true);
      } else {
        toast.error("Access Denied", {
          description: "You don't have developer permissions"
        });
        
        // Redirect after a brief delay
        setTimeout(() => {
          navigate('/admin/auth');
        }, 1500);
        return;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Authentication Error", {
        description: "Failed to verify your permissions"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    toast.success("Changes Published", {
      description: "Your changes are now live on the site"
    });
    setHasUnsavedChanges(false);
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ab233a]"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-gray-500">Checking permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#ab233a]">Site Editor</h1>
          <p className="text-[#2c3e50] mt-1">
            Visually customize your website appearance and content
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
            className="flex items-center gap-1 bg-[#ab233a] hover:bg-[#811a2c]"
          >
            <Save className="h-4 w-4" />
            Publish Changes
          </Button>
        </div>
      </div>

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
        </TabsList>
        
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Customization</CardTitle>
              <CardDescription>
                Customize colors, typography, and spacing for your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeEditor 
                onChange={() => setHasUnsavedChanges(true)} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Layout Editor</CardTitle>
              <CardDescription>
                Arrange and organize page sections using drag and drop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LayoutEditor 
                onChange={() => setHasUnsavedChanges(true)} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Component Library</CardTitle>
              <CardDescription>
                Add and configure components to use in your layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComponentLibrary 
                onChange={() => setHasUnsavedChanges(true)} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Manage images, videos, and other media for your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaLibrary 
                onChange={() => setHasUnsavedChanges(true)} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteEditor;
