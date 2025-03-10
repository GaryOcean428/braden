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
      
      // Verify developer status by email
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
      
      // User is confirmed as the developer, now try to load pages with updated RLS policies
      console.log("Developer verified, loading pages with updated RLS policies");
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

  return {
    pages,
    loading,
    error,
    isPermissionError,
    isAdmin,
    loadPages
  };
}
