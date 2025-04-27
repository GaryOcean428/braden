
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MediaFile {
  id: string;
  title: string;
  file_path: string;
  file_type?: string;
  created_at: string;
  updated_at: string;
}

export const useMediaManagement = (bucketName: string = 'media') => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: files, error: listError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (listError) throw listError;

      setFiles(files || []);
    } catch (err: any) {
      console.error('Error loading files:', err);
      setError('Failed to load files. Please try again.');
      toast.error("Error loading files", {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('media')
        .insert({
          title: file.name,
          file_path: filePath,
          file_type: file.type
        });

      if (dbError) throw dbError;

      toast.success('File uploaded successfully');
      await loadFiles();
      return true;
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
      toast.error("Upload failed", {
        description: err.message
      });
      return false;
    } finally {
      setUploading(false);
    }
  }, [bucketName, loadFiles]);

  const deleteFile = useCallback(async (id: string, filePath: string) => {
    try {
      setError(null);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete database record
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast.success('File deleted successfully');
      await loadFiles();
      return true;
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file. Please try again.');
      toast.error("Delete failed", {
        description: err.message
      });
      return false;
    }
  }, [bucketName, loadFiles]);

  return {
    files,
    loading,
    uploading,
    error,
    loadFiles,
    uploadFile,
    deleteFile
  };
};
