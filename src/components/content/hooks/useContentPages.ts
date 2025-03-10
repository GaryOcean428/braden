
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentPage } from "@/integrations/supabase/database.types";
import { toast } from "sonner";

export function useContentPages() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("content_pages")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setPages(data as ContentPage[]);
    } catch (error: any) {
      console.error("Error fetching pages:", error);
      setError(error.message || "Failed to load content pages");
      toast.error("Error", {
        description: "Failed to load content pages"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("content_pages")
        .update({ is_published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      // Update the local state
      setPages(pages.map(page => 
        page.id === id ? { ...page, is_published: !currentStatus } : page
      ));

      toast.success(!currentStatus ? "Page published" : "Page unpublished", {
        description: `Page has been ${!currentStatus ? "published" : "unpublished"} successfully`
      });
    } catch (error) {
      console.error("Error updating page status:", error);
      toast.error("Error", {
        description: "Failed to update page status"
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      
      const { error } = await supabase
        .from("content_pages")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      // Update the local state
      setPages(pages.filter(page => page.id !== deleteId));
      setDeleteId(null);

      toast.success("Page deleted", {
        description: "Page has been deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Error", {
        description: "Failed to delete page"
      });
    } finally {
      setDeleting(false);
    }
  };

  return {
    pages,
    loading,
    error,
    deleteId,
    deleting,
    setDeleteId,
    fetchPages,
    handleTogglePublish,
    handleDelete
  };
}
