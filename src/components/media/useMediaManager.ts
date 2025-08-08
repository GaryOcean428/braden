import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MediaItem } from './types';

export const useMediaManager = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  // Load images when hook is initialized or manually refreshed
  useEffect(() => {
    loadImages();
  }, [lastRefreshTime]);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we're authenticated first
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Authentication required');
        toast.error('Authentication required', {
          description: 'Please sign in to access media library',
        });
        setLoading(false);
        return;
      }

      // Try to fetch media items from database
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (
          error.code === '42501' ||
          error.message?.includes('permission denied')
        ) {
          console.error('Permission denied when accessing media table:', error);
          toast.error('Permission denied', {
            description:
              "You don't have sufficient permissions to access media",
          });
        } else {
          console.error('Error loading images:', error);
          toast.error('Failed to load images', {
            description: 'There was a database error fetching your media files',
          });
        }
        throw error;
      }

      setImages((data as MediaItem[]) || []);
    } catch (error: any) {
      console.error('Error loading images:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshImages = useCallback(() => {
    setLastRefreshTime(Date.now());
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      // Check authentication status
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Authentication required');
        toast.error('Authentication required', {
          description: 'Please sign in to upload media',
        });
        return;
      }

      console.log('Upload initiated with authentication');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 7)}_${Date.now()}.${fileExt}`;

      // First try to upload to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error details:', uploadError);

        if (uploadError.message?.includes('row-level security')) {
          toast.error('Permission denied', {
            description: "You don't have permissions to upload files",
          });
        } else {
          toast.error('Upload failed', {
            description: 'An error occurred during file upload',
          });
        }
        throw uploadError;
      }

      // Then record in database
      const { error: dbError } = await supabase.from('media').insert({
        title: file.name,
        file_path: fileName,
        file_type: file.type,
      });

      if (dbError) throw dbError;

      toast.success('Image uploaded successfully', {
        description: `${file.name} has been uploaded to your media library.`,
      });

      // Refresh the image list
      refreshImages();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string, filePath: string) => {
    try {
      const confirmed = window.confirm(
        'Are you sure you want to delete this image?'
      );
      if (!confirmed) return;

      setError(null);

      // First delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);

        // Continue with database deletion even if storage deletion fails
        // This handles cases where the file might not exist in storage
        console.warn('Continuing with database deletion despite storage error');
      }

      // Then delete from database
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast.success('Image deleted', {
        description: 'The image has been successfully removed.',
      });

      // Refresh the image list
      refreshImages();
    } catch (error: any) {
      console.error('Error deleting image:', error);
      setError(error.message);
      toast.error('Delete failed', {
        description:
          'There was a problem deleting the image. Please try again.',
      });
    }
  };

  return {
    uploading,
    loading,
    images,
    error,
    loadImages,
    refreshImages,
    handleFileUpload,
    deleteImage,
  };
};
