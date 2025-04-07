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
      
      // Get current user session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to upload images');
      }
      
      console.log('Uploading with auth token:', session.access_token.substring(0, 10) + '...');
      
      // Upload file to Supabase Storage with explicit auth header
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Changed to true to overwrite if file exists
          duplex: 'half',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'x-upsert': 'true'
          }
        });
      
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      setUploadedUrl(publicUrl);
      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
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
      
      // Get current user session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to delete images');
      }
      
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath], {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
      
      if (deleteError) {
        console.error('Delete error details:', deleteError);
        throw deleteError;
      }
      
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during deletion'));
      return false;
    }
  };
  
  // List images in a bucket
  const listImages = async (path?: string) => {
    try {
      setError(null);
      
      // Get current user session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn('No active session found, listing may be restricted');
      }
      
      const { data, error: listError } = await supabase.storage
        .from(bucketName)
        .list(path || '', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (listError) {
        console.error('List error details:', listError);
        throw listError;
      }
      
      // Filter out folders, only include files
      const files = data.filter(item => !item.id.endsWith('/'));
      
      // Map files to include public URLs
      const filesWithUrls = files.map(file => {
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
      console.error('List error:', err);
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
