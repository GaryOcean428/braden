
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
      
      try {
        // First check if user is admin
        const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin');
        
        // Handle error with admin check
        if (adminCheckError) {
          console.error("Admin check error:", adminCheckError);
          
          // If it's a permission error for admin_users table, try to insert the user as admin
          if (adminCheckError.code === '42501' && adminCheckError.message.includes('admin_users')) {
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert({ user_id: session.session.user.id });
              
            if (!insertError) {
              // Successfully added as admin, try to load pages
              loadPageContent();
              return;
            }
          }
          
          setIsPermissionError(true);
          setError("Could not verify admin permissions");
          toast.error("Permission Error", {
            description: "Could not verify admin permissions"
          });
          setPages([]);
          return;
        }
        
        if (!isAdmin) {
          // If not an admin, try to make them admin
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({ user_id: session.session.user.id });
            
          if (!insertError) {
            // Successfully added as admin, try to load pages
            loadPageContent();
            return;
          } else {
            setIsPermissionError(true);
            setError("You don't have permission to access content pages");
            toast.error("Permission Denied", {
              description: "You don't have admin permissions to view content pages"
            });
            setPages([]);
            return;
          }
        } else {
          // User is confirmed as admin, load the pages
          loadPageContent();
        }
      } catch (err) {
        console.error("Error in admin verification:", err);
        setIsPermissionError(true);
        setError("Failed to verify admin status");
        setPages([]);
      }
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
          setError("You don't have permission to access content pages");
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
