
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_published: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('content_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (pagesError) throw pagesError;
      setPages(pagesData || []);

      // Load content blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .order('created_at', { ascending: false });

      if (blocksError) throw blocksError;
      setBlocks(blocksData || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      });
    }
  };

  const handleCreatePage = async () => {
    try {
      const { error } = await supabase
        .from('content_pages')
        .insert([{
          ...newPage,
          content: JSON.stringify({ content: newPage.content }),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page created successfully",
      });

      setNewPage({
        title: '',
        slug: '',
        content: '',
        meta_description: '',
        is_published: false
      });

      loadContent();
    } catch (error) {
      console.error('Error creating page:', error);
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Create and manage website content pages
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/content">Manage Content</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Manage admins and user accounts
            </p>
            <Button variant="outline" className="w-full">
              Manage Users
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Site Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Configure website settings and preferences
            </p>
            <Button variant="outline" className="w-full">
              Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Recent Pages</TabsTrigger>
          <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <div className="grid gap-4">
            {pages.slice(0, 5).map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Slug: {page.slug}</p>
                  <p className="text-sm text-gray-500">
                    Status: {page.is_published ? 'Published' : 'Draft'}
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/content/edit/${page.id}`}>Edit</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pages.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No pages found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="blocks">
          <div className="grid gap-4">
            {blocks.map((block) => (
              <Card key={block.id}>
                <CardHeader>
                  <CardTitle>{block.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Type: {block.type}</p>
                </CardContent>
              </Card>
            ))}
            {blocks.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No content blocks found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
