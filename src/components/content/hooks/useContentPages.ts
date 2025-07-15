import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

export function useContentPages() {
  const [pages, setPages] = useState<ContentPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isPermissionError, setIsPermissionError] = useState(false);
  const {
    isDeveloper,
    isAdmin,
    loading: permissionsLoading,
  } = useAdminPermissions();

  useEffect(() => {
    if (!permissionsLoading) {
      fetchPages();
    }
  }, [permissionsLoading]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsPermissionError(false);

      const { data: session, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !session.session) {
        setIsPermissionError(true);
        setError('You must be logged in to view content');
        toast.error('Authentication Required', {
          description: 'Please log in to view content pages',
        });
        setPages([]);
        return;
      }

      // Check if user is an admin by direct email verification or through permissions
      const userEmail = session.session.user.email;

      if (userEmail === 'braden.lang77@gmail.com' || isAdmin || isDeveloper) {
        // User is confirmed as an admin, load the content pages
        try {
          const { data, error } = await supabase
            .from('content_pages')
            .select('*')
            .order('updated_at', { ascending: false });

          if (error) {
            console.error('Error fetching pages:', error);
            setError(error.message || 'Failed to load content pages');
            toast.error('Error', {
              description: 'Failed to load content pages',
            });
            setPages([]);
          } else {
            setPages(data as ContentPageData[]);
          }
        } catch (err) {
          console.error('Error loading content pages:', err);
          setError('Failed to load content pages');
          setPages([]);
        }
      } else {
        setIsPermissionError(true);
        setError("You don't have permission to access content pages");
        toast.error('Permission Denied', {
          description: 'Only administrators can access this section',
        });
        setPages([]);
      }
    } catch (error: any) {
      console.error('Error fetching pages:', error);
      setPages([]);
      setError(error.message || 'Failed to load content pages');
      toast.error('Error', {
        description: 'Failed to load content pages',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      if (!isAdmin && !isDeveloper) {
        toast.error('Permission Denied', {
          description: 'Only administrators can update page status',
        });
        return;
      }

      const { error } = await supabase
        .from('content_pages')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) {
        toast.error('Error', {
          description: 'Failed to update page status',
        });
        throw error;
      }

      // Update the local state
      setPages(
        pages.map((page) =>
          page.id === id ? { ...page, is_published: !currentStatus } : page
        )
      );

      toast.success(!currentStatus ? 'Page published' : 'Page unpublished', {
        description: `Page has been ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating page status:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      if (!isAdmin && !isDeveloper) {
        toast.error('Permission Denied', {
          description: 'Only administrators can delete pages',
        });
        setDeleting(false);
        return;
      }

      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', deleteId);

      if (error) {
        toast.error('Error', {
          description: 'Failed to delete page',
        });
        throw error;
      }

      // Update the local state
      setPages(pages.filter((page) => page.id !== deleteId));
      setDeleteId(null);

      toast.success('Page deleted', {
        description: 'Page has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting page:', error);
    } finally {
      setDeleting(false);
    }
  };

  const addPage = async (title: string, slug: string, content: string) => {
    try {
      setLoading(true);

      if (!isAdmin && !isDeveloper) {
        toast.error('Permission Denied', {
          description: 'Only administrators can add pages',
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

      setPages([...pages, ...(data as ContentPageData[])]);
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
          description: 'Only administrators can edit pages',
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
    handleDelete,
    addPage,
    editPage,
  };
}
