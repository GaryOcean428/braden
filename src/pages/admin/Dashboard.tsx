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
import { Puck, type Config } from "@measured/puck";
import "@measured/puck/dist/index.css";
import { Hero, About, Services, Contact } from "@/components/PuckEditor";
import { fetchData, migrateData, usePuck } from "@measured/puck";

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

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Create New Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  placeholder="Page Title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  placeholder="page-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newPage.content}
                  onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                  placeholder="Page content..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta">Meta Description</Label>
                <Input
                  id="meta"
                  value={newPage.meta_description}
                  onChange={(e) => setNewPage({ ...newPage, meta_description: e.target.value })}
                  placeholder="Meta description"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={newPage.is_published}
                  onCheckedChange={(checked) => setNewPage({ ...newPage, is_published: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <Button onClick={handleCreatePage}>Create Page</Button>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-4">
            {pages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Slug: {page.slug}</p>
                  <p className="text-sm text-gray-500">
                    Status: {page.is_published ? 'Published' : 'Draft'}
                  </p>
                </CardContent>
              </Card>
            ))}
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
