
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MediaItem } from "./types";

export const useMediaManager = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load images when hook is initialized
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use a type assertion to avoid TypeScript errors
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false }) as { data: MediaItem[] | null, error: any };

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      console.error('Error loading images:', error);
      setError(error.message);
      toast("Failed to load images", {
        description: "There was a problem fetching your media files.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setError(null);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Use type assertion to avoid TypeScript errors
      const { error: dbError } = await supabase
        .from('media')
        .insert({
          title: file.name,
          file_path: filePath,
          file_type: file.type,
        }) as { error: any };

      if (dbError) throw dbError;

      toast("Image uploaded successfully", {
        description: `${file.name} has been uploaded to your media library.`
      });

      // Refresh the image list
      loadImages();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setError(error.message);
      toast("Upload failed", {
        description: "There was a problem uploading your file. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string, filePath: string) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this image?');
      if (!confirmed) return;

      setError(null);
      
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Use type assertion to avoid TypeScript errors
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .match({ id }) as { error: any };

      if (dbError) throw dbError;

      toast("Image deleted", {
        description: "The image has been successfully removed."
      });

      // Refresh the image list
      loadImages();
    } catch (error: any) {
      console.error('Error deleting image:', error);
      setError(error.message);
      toast("Delete failed", {
        description: "There was a problem deleting the image. Please try again.",
      });
    }
  };

  return {
    uploading,
    loading,
    images,
    error,
    loadImages,
    handleFileUpload,
    deleteImage
  };
};
