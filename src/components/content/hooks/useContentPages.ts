
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
  const [isPermissionError, setIsPermissionError] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsPermissionError(false);
      
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session.session) {
        setIsPermissionError(true);
        setError("You must be logged in to view content");
        toast.error("Authentication Required", {
          description: "Please log in to view content pages"
        });
        setPages([]);
        return;
      }
      
      // Check if user is the developer by direct email verification
      // This avoids the problematic RPC call that's causing the 400 errors
      const userEmail = session.session.user.email;
      
      if (userEmail !== 'braden.lang77@gmail.com') {
        setIsPermissionError(true);
        setError("You don't have permission to access content pages");
        toast.error("Permission Denied", {
          description: "Only the developer can access this section"
        });
        setPages([]);
        return;
      }
      
      // User is confirmed as the developer, load the content pages
      try {
        const { data, error } = await supabase
          .from("content_pages")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("Error fetching pages:", error);
          
          // Check if it's a permission issue
          if (error.message.toLowerCase().includes('permission') || 
              error.message.toLowerCase().includes('access denied') ||
              error.code === 'PGRST301') {
            setIsPermissionError(true);
            setError("Database access restricted. Please check your permissions.");
            toast.error("Permission Denied", {
              description: "You don't have permission to access this data"
            });
          } else {
            setError(error.message || "Failed to load content pages");
            toast.error("Error", {
              description: "Failed to load content pages"
            });
          }
          
          setPages([]);
        } else {
          setPages(data as ContentPage[]);
        }
      } catch (err) {
        console.error("Error loading content pages:", err);
        setError("Failed to load content pages");
        setPages([]);
      }
    } catch (error: any) {
      console.error("Error fetching pages:", error);
      setPages([]);
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
      // Check if user is the developer by checking the session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("Authentication Required", {
          description: "Please log in to update page status"
        });
        return;
      }
      
      const userEmail = sessionData.session.user.email;
      
      if (userEmail !== 'braden.lang77@gmail.com') {
        toast.error("Permission Denied", {
          description: "Only the developer can update page status"
        });
        return;
      }
      
      const { error } = await supabase
        .from("content_pages")
        .update({ is_published: !currentStatus })
        .eq("id", id);

      if (error) {
        if (error.message.toLowerCase().includes('permission') || 
            error.code === 'PGRST301') {
          toast.error("Permission Denied", {
            description: "You don't have permission to update page status"
          });
        } else {
          toast.error("Error", {
            description: "Failed to update page status"
          });
        }
        throw error;
      }

      // Update the local state
      setPages(pages.map(page => 
        page.id === id ? { ...page, is_published: !currentStatus } : page
      ));

      toast.success(!currentStatus ? "Page published" : "Page unpublished", {
        description: `Page has been ${!currentStatus ? "published" : "unpublished"} successfully`
      });
    } catch (error: any) {
      console.error("Error updating page status:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      
      // Verify developer by email instead of admin role
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("Authentication Required", {
          description: "Please log in to delete pages"
        });
        setDeleting(false);
        return;
      }
      
      const userEmail = sessionData.session.user.email;
      
      if (userEmail !== 'braden.lang77@gmail.com') {
        toast.error("Permission Denied", {
          description: "Only the developer can delete pages"
        });
        setDeleting(false);
        return;
      }
      
      const { error } = await supabase
        .from("content_pages")
        .delete()
        .eq("id", deleteId);

      if (error) {
        if (error.message.toLowerCase().includes('permission') || 
            error.code === 'PGRST301') {
          toast.error("Permission Denied", {
            description: "You don't have permission to delete this page"
          });
        } else {
          toast.error("Error", {
            description: "Failed to delete page"
          });
        }
        throw error;
      }

      // Update the local state
      setPages(pages.filter(page => page.id !== deleteId));
      setDeleteId(null);

      toast.success("Page deleted", {
        description: "Page has been deleted successfully"
      });
    } catch (error: any) {
      console.error("Error deleting page:", error);
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
    isPermissionError,
    setDeleteId,
    fetchPages,
    handleTogglePublish,
    handleDelete
  };
}
