import { useState, useEffect } from 'react';
import { supabase, STORAGE_BUCKETS } from '@/integrations/supabase/client';

export const useImageUpload = (bucketName = STORAGE_BUCKETS.CONTENT_IMAGES) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Upload image to Supabase Storage
  const uploadImage = async (file: File, path?: string) => {
    if (!file) return null;
    
    try {
      setUploading(true);
      setError(null);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;
      
      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      setUploadedUrl(publicUrl);
      return publicUrl;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error during upload'));
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  // Delete image from Supabase Storage
  const deleteImage = async (filePath: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (deleteError) {
        throw deleteError;
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error during deletion'));
      return false;
    }
  };
  
  // List images in a bucket
  const listImages = async (path?: string) => {
    try {
      setError(null);
      
      const { data, error: listError } = await supabase.storage
        .from(bucketName)
        .list(path || '');
      
      if (listError) {
        throw listError;
      }
      
      // Map files to include public URLs
      const filesWithUrls = data.map(file => {
        const filePath = path ? `${path}/${file.name}` : file.name;
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        
        return {
          ...file,
          publicUrl
        };
      });
      
      return filesWithUrls;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error listing files'));
      return [];
    }
  };
  
  return {
    uploadImage,
    deleteImage,
    listImages,
    uploading,
    error,
    uploadedUrl
  };
};
