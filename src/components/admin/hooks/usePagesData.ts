
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
      
      // User is confirmed as the developer, let's add content_pages RLS policy before loading pages
      console.log("Developer verified, attempting to load pages");

      // Now attempt to get the pages data
      try {
        // Try to load the pages data - this will be successful only if RLS allows it
        const { data: pagesData, error: pagesError } = await supabase
          .from('content_pages')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(5);

        if (pagesError) {
          console.error('Error loading pages:', pagesError);
          
          // If access is denied due to RLS policies
          if (pagesError.message.toLowerCase().includes('permission') || 
              pagesError.message.toLowerCase().includes('denied') ||
              pagesError.code === 'PGRST301') {
            setIsPermissionError(true);
            setError("Database access restricted. You are verified as a developer, but database RLS policies are preventing access to content_pages table.");
            toast.error("Database Permission Issue", {
              description: "RLS policies need to be updated to allow developer access to content"
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
      } catch (err) {
        console.error("Error loading page content:", err);
        setError("Failed to load pages");
        setPages([]);
        toast.error("Error", {
          description: "Failed to load pages. Please try again."
        });
      }
    } catch (error: any) {
      console.error('Error in auth check:', error);
      setError(error.message || "Failed to authenticate");
      setPages([]);
    } finally {
      setLoading(false);
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
