import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentPage } from "@/integrations/supabase/database.types";

export function usePagesData() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionError, setIsPermissionError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsPermissionError(false);
      
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session.session) {
        setIsPermissionError(true);
        setError("You must be logged in to view content");
        toast.error("Authentication Required", {
          description: "Please log in to view admin content"
        });
        setPages([]);
        return;
      }
      
      const userId = session.session.user.id;
      
      const { data: hasPermission, error: permissionError } = await supabase.rpc('check_permission', {
        user_id: userId,
        resource_type: 'content_pages',
        resource_id: null,
        action: 'view'
      });

      if (permissionError || !hasPermission) {
        setIsPermissionError(true);
        setError("You don't have permission to access content pages");
        toast.error("Permission Denied", {
          description: "You don't have the required permissions to access this section"
        });
        setPages([]);
        return;
      }
      
      // User is confirmed to have the required permissions, now try to load pages with updated RLS policies
      console.log("Permissions verified, loading pages with updated RLS policies");
      setIsAdmin(true);

      // Get the pages data
      const { data: pagesData, error: pagesError } = await supabase
        .from('content_pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (pagesError) {
        console.error('Error loading pages:', pagesError);
        
        // If access is still denied due to RLS policies
        if (pagesError.message.toLowerCase().includes('permission') || 
            pagesError.message.toLowerCase().includes('denied') ||
            pagesError.code === 'PGRST301') {
          setIsPermissionError(true);
          setError("Database access restricted. RLS policies have been updated but might need a session refresh. Please try logging out and back in.");
          toast.error("Database Permission Issue", {
            description: "Try logging out and back in to refresh your session"
          });
        } else {
          setError(pagesError.message || "Failed to load pages");
          toast.error("Error", {
            description: "Failed to load pages due to a database error"
          });
        }
        
        setPages([]);
      } else {
        console.log("Pages loaded successfully");
        setPages(pagesData || []);
      }
    } catch (err: any) {
      console.error("Error in auth check:", err);
      setError(err.message || "Failed to authenticate");
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const addPage = async (title: string, slug: string, content: string) => {
    try {
      setLoading(true);
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session.session) {
        toast.error("Authentication Required", {
          description: "Please log in to add a page"
        });
        return;
      }
      
      const userId = session.session.user.id;
      
      const { data: hasPermission, error: permissionError } = await supabase.rpc('check_permission', {
        user_id: userId,
        resource_type: 'content_pages',
        resource_id: null,
        action: 'create'
      });

      if (permissionError || !hasPermission) {
        toast.error("Permission Denied", {
          description: "You don't have the required permissions to add pages"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('content_pages')
        .insert([{ title, slug, content }])
        .single();

      if (error) {
        toast.error("Error", {
          description: "Failed to add page"
        });
        throw error;
      }

      setPages([...pages, data]);
      toast.success("Page added successfully");
    } catch (error: any) {
      console.error("Error adding page:", error);
      setError(error.message || "Failed to add page");
    } finally {
      setLoading(false);
    }
  };

  const editPage = async (id: string, title: string, slug: string, content: string) => {
    try {
      setLoading(true);
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session.session) {
        toast.error("Authentication Required", {
          description: "Please log in to edit a page"
        });
        return;
      }
      
      const userId = session.session.user.id;
      
      const { data: hasPermission, error: permissionError } = await supabase.rpc('check_permission', {
        user_id: userId,
        resource_type: 'content_pages',
        resource_id: id,
        action: 'update'
      });

      if (permissionError || !hasPermission) {
        toast.error("Permission Denied", {
          description: "You don't have the required permissions to edit pages"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('content_pages')
        .update({ title, slug, content })
        .eq('id', id)
        .single();

      if (error) {
        toast.error("Error", {
          description: "Failed to edit page"
        });
        throw error;
      }

      setPages(pages.map(page => page.id === id ? data : page));
      toast.success("Page updated successfully");
    } catch (error: any) {
      console.error("Error editing page:", error);
      setError(error.message || "Failed to edit page");
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    try {
      setLoading(true);
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session.session) {
        toast.error("Authentication Required", {
          description: "Please log in to delete a page"
        });
        return;
      }
      
      const userId = session.session.user.id;
      
      const { data: hasPermission, error: permissionError } = await supabase.rpc('check_permission', {
        user_id: userId,
        resource_type: 'content_pages',
        resource_id: id,
        action: 'delete'
      });

      if (permissionError || !hasPermission) {
        toast.error("Permission Denied", {
          description: "You don't have the required permissions to delete pages"
        });
        return;
      }
      
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Error", {
          description: "Failed to delete page"
        });
        throw error;
      }

      setPages(pages.filter(page => page.id !== id));
      toast.success("Page deleted successfully");
    } catch (error: any) {
      console.error("Error deleting page:", error);
      setError(error.message || "Failed to delete page");
    } finally {
      setLoading(false);
    }
  };

  return {
    pages,
    loading,
    error,
    isPermissionError,
    isAdmin,
    loadPages,
    addPage,
    editPage,
    deletePage
  };
}
