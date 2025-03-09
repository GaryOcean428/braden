
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ContentPage } from "@/integrations/supabase/database.types";

// Form schema validation
const contentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  meta_description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  is_published: z.boolean().default(false),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

interface ContentFormProps {
  contentId?: string;
  onSuccess?: () => void;
}

export function ContentForm({ contentId, onSuccess }: ContentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      meta_description: "",
      content: "",
      is_published: false,
    },
  });

  useEffect(() => {
    const loadContentPage = async () => {
      if (!contentId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("content_pages")
          .select("*")
          .eq("id", contentId)
          .single();

        if (error) throw error;

        if (data) {
          form.reset({
            title: data.title,
            slug: data.slug,
            meta_description: data.meta_description || "",
            content: JSON.stringify(data.content),
            is_published: data.is_published,
          });
        }
      } catch (error) {
        console.error("Error loading content page:", error);
        toast({
          title: "Error",
          description: "Failed to load content page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadContentPage();
  }, [contentId, form, toast]);

  const onSubmit = async (values: ContentFormValues) => {
    try {
      setLoading(true);

      // Parse the content string as JSON
      let contentObject;
      try {
        contentObject = JSON.parse(values.content);
      } catch (error) {
        contentObject = values.content;
      }

      const pageData = {
        title: values.title,
        slug: values.slug,
        meta_description: values.meta_description,
        content: contentObject,
        is_published: values.is_published,
      };

      let result;

      if (contentId) {
        // Update existing page
        result = await supabase
          .from("content_pages")
          .update(pageData)
          .eq("id", contentId);
      } else {
        // Create new page
        result = await supabase
          .from("content_pages")
          .insert([pageData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: contentId ? "Page updated successfully" : "Page created successfully",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving content page:", error);
      toast({
        title: "Error",
        description: "Failed to save content page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title"
            {...form.register("title")}
            className="mt-1 w-full"
            placeholder="Page Title"
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input 
            id="slug"
            {...form.register("slug")}
            className="mt-1 w-full" 
            placeholder="page-slug"
          />
          {form.formState.errors.slug && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.slug.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea 
            id="meta_description"
            {...form.register("meta_description")}
            className="mt-1 w-full"
            placeholder="Page description for SEO purposes"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="content">Content (JSON)</Label>
          <Textarea 
            id="content"
            {...form.register("content")}
            className="mt-1 w-full font-mono"
            placeholder='{"blocks": []}'
            rows={10}
          />
          {form.formState.errors.content && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="is_published"
            checked={form.watch("is_published")}
            onCheckedChange={(checked) => form.setValue("is_published", checked)}
          />
          <Label htmlFor="is_published">Publish this page</Label>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : contentId ? "Update Page" : "Create Page"}
      </Button>
    </form>
  );
}
