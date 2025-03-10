
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentPage } from "@/integrations/supabase/database.types";

export function usePagesData() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionError, setIsPermissionError] = useState(false);

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
      
      // Verify developer status by email instead of using the RPC function
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
      
      // User is confirmed as the developer, load the pages
      loadPageContent();
    } catch (error: any) {
      console.error('Error in auth check:', error);
      setError(error.message || "Failed to authenticate");
      setPages([]);
    } finally {
      setLoading(false);
    }
  };
  
  const loadPageContent = async () => {
    try {
      const { data: pagesData, error: pagesError } = await supabase
        .from('content_pages')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (pagesError) {
        console.error('Error loading pages:', pagesError);
        
        // Check if it's a permission error
        if (pagesError.message.toLowerCase().includes('permission') || 
            pagesError.message.toLowerCase().includes('denied') ||
            pagesError.code === 'PGRST301') {
          setIsPermissionError(true);
          setError("Database access restricted. Please check your permissions.");
        } else {
          setError(pagesError.message || "Failed to load pages");
        }
        
        setPages([]);
        toast.error("Error", {
          description: "Failed to load pages. Please try again."
        });
      } else {
        setPages(pagesData || []);
      }
    } catch (err) {
      console.error("Error loading page content:", err);
      setError("Failed to load pages");
      setPages([]);
    }
  };

  return {
    pages,
    loading,
    error,
    isPermissionError,
    loadPages
  };
}
