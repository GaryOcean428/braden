
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContentFormProps {
  contentId?: string;
  onSuccess?: () => void;
}

export function ContentForm({ contentId, onSuccess }: ContentFormProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (contentId) {
      loadContent(contentId);
    }
  }, [contentId]);

  const loadContent = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("content_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setMetaDescription(data.meta_description || "");
        setContent(JSON.stringify(data.content, null, 2));
        setIsPublished(data.is_published);
      }
    } catch (error) {
      console.error("Error loading content:", error);
      toast({
        title: "Error",
        description: "Failed to load page content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let contentObj;
      try {
        contentObj = JSON.parse(content);
      } catch (error) {
        toast({
          title: "Invalid JSON",
          description: "Please ensure your content is valid JSON",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const pageData = {
        title,
        slug,
        content: contentObj,
        meta_description: metaDescription,
        is_published: isPublished,
        updated_at: new Date(),
      };

      let operation;
      if (contentId) {
        operation = supabase
          .from("content_pages")
          .update(pageData)
          .eq("id", contentId);
      } else {
        operation = supabase.from("content_pages").insert([pageData]);
      }

      const { error } = await operation;

      if (error) throw error;

      toast({
        title: "Success",
        description: `Page ${contentId ? "updated" : "created"} successfully`,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: `Failed to ${contentId ? "update" : "create"} page content`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Page Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Home Page"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          placeholder="home"
        />
        <p className="text-sm text-gray-500">
          This will be the URL of your page: /page/[slug]
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="A brief description of the page (for SEO)"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Page Content (JSON)</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='{"sections": [], "components": []}'
          rows={10}
          required
          className="font-mono text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : contentId ? "Update Page" : "Create Page"}
      </Button>
    </form>
  );
}
