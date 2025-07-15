import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContentPage } from '@/integrations/supabase/database.types';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

interface ContentPageData {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta_description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function usePagesData() {
  const [pages, setPages] = useState<ContentPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionError, setIsPermissionError] = useState(false);
  const {
    isDeveloper,
    isAdmin,
    loading: permissionsLoading,
  } = useAdminPermissions();

  useEffect(() => {
    if (!permissionsLoading) {
      loadPages();
    }
  }, [permissionsLoading]);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsPermissionError(false);

      // Check if user session exists
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !session.session) {
        setIsPermissionError(true);
        setError('You must be logged in to view content');
        toast.error('Authentication Required', {
          description: 'Please log in to view admin content',
        });
        setPages([]);
        return;
      }

      const userEmail = session.session.user.email;

      // First, try by email - most reliable method
      if (userEmail === 'braden.lang77@gmail.com' || isAdmin || isDeveloper) {
        console.log('Admin access confirmed, loading pages');

        // Get the pages data
        const { data: pagesData, error: pagesError } = await supabase
          .from('content_pages')
          .select('*')
          .order('updated_at', { ascending: false });

        if (pagesError) {
          console.error('Error loading pages:', pagesError);
          setError(pagesError.message || 'Failed to load pages');
          toast.error('Error', {
            description: 'Failed to load pages due to a database error',
          });
          setPages([]);
        } else {
          console.log('Pages loaded successfully');
          setPages(pagesData as ContentPageData[]);
        }
      } else {
        setIsPermissionError(true);
        setError("You don't have permission to access content pages");
        toast.error('Permission Denied', {
          description: "You don't have the required permissions",
        });
        setPages([]);
      }
    } catch (err: any) {
      console.error('Error in auth check:', err);
      setError(err.message || 'Failed to authenticate');
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const addPage = async (title: string, slug: string, content: string) => {
    try {
      setLoading(true);

      if (!isAdmin && !isDeveloper) {
        toast.error('Permission Denied', {
          description: "You don't have the required permissions to add pages",
        });
        return;
      }

      const { data, error } = await supabase
        .from('content_pages')
        .insert([{ title, slug, content }])
        .select();

      if (error) {
        toast.error('Error', {
          description: 'Failed to add page',
        });
        throw error;
      }

      setPages((prev) => [...prev, ...(data as ContentPageData[])]);
      toast.success('Page added successfully');
    } catch (error: any) {
      console.error('Error adding page:', error);
      setError(error.message || 'Failed to add page');
    } finally {
      setLoading(false);
    }
  };

  const editPage = async (
    id: string,
    title: string,
    slug: string,
    content: string
  ) => {
    try {
      setLoading(true);

      if (!isAdmin && !isDeveloper) {
        toast.error('Permission Denied', {
          description: "You don't have the required permissions to edit pages",
        });
        return;
      }

      const { data, error } = await supabase
        .from('content_pages')
        .update({ title, slug, content })
        .eq('id', id)
        .select();

      if (error) {
        toast.error('Error', {
          description: 'Failed to edit page',
        });
        throw error;
      }

      const updatedPage = data?.[0] as ContentPageData;
      setPages(pages.map((page) => (page.id === id ? updatedPage : page)));
      toast.success('Page updated successfully');
    } catch (error: any) {
      console.error('Error editing page:', error);
      setError(error.message || 'Failed to edit page');
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    try {
      setLoading(true);

      if (!isAdmin && !isDeveloper) {
        toast.error('Permission Denied', {
          description:
            "You don't have the required permissions to delete pages",
        });
        return;
      }

      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Error', {
          description: 'Failed to delete page',
        });
        throw error;
      }

      setPages(pages.filter((page) => page.id !== id));
      toast.success('Page deleted successfully');
    } catch (error: any) {
      console.error('Error deleting page:', error);
      setError(error.message || 'Failed to delete page');
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
    deletePage,
  };
}
