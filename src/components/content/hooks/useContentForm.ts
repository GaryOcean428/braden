
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { contentFormSchema, ContentFormValues } from "../schema/contentFormSchema";

interface UseContentFormProps {
  contentId?: string;
  onSuccess?: () => void;
}

export function useContentForm({ contentId, onSuccess }: UseContentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!contentId);
  const [loadError, setLoadError] = useState<string | null>(null);

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
    if (contentId) {
      loadContentPage(contentId);
    } else {
      setInitialLoading(false);
    }
  }, [contentId]);

  const loadContentPage = async (id: string) => {
    try {
      setInitialLoading(true);
      setLoadError(null);
      
      const { data, error } = await supabase
        .from("content_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        form.reset({
          title: data.title,
          slug: data.slug,
          meta_description: data.meta_description || "",
          content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content),
          is_published: data.is_published,
        });
      }
    } catch (error) {
      console.error("Error loading content page:", error);
      setLoadError("Failed to load content page");
      toast({
        title: "Error",
        description: "Failed to load content page",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

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

  return {
    form,
    loading,
    initialLoading,
    loadError,
    onSubmit,
    loadContentPage
  };
}
