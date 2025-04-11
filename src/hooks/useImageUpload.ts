
import { useState } from 'react';
import { supabase, STORAGE_BUCKETS } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      
      // Attempt to get session, but proceed with upload regardless
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthenticated = !!session;
      
      console.log(`Upload initiated${isAuthenticated ? ' with authentication' : ' without authentication'}`);
      
      // Upload file to Supabase Storage
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      let { data, error: uploadError } = uploadResult;
      
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        
        if (uploadError.message.includes('row level security')) {
          // Attempt to sign in as admin for this upload
          console.log('Attempting admin sign in for upload...');
          const adminResult = await ensureGuestAccess();
          
          if (adminResult) {
            // Retry upload
            const retryResult = await supabase.storage
              .from(bucketName)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
              });
              
            if (retryResult.error) {
              console.error('Retry upload failed:', retryResult.error);
              throw retryResult.error;
            }
            
            data = retryResult.data;
            console.log('Upload succeeded after admin sign in');
          } else {
            throw uploadError;
          }
        } else {
          throw uploadError;
        }
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      setUploadedUrl(publicUrl);
      toast.success('Image uploaded successfully');
      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during upload'));
      toast.error("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  // Ensure guest access for uploads
  const ensureGuestAccess = async () => {
    try {
      // Call a function to handle guest uploads temporarily
      const { error } = await supabase.functions.invoke('ensure-guest-storage-access', {
        body: { bucket: bucketName }
      });
      
      if (error) {
        console.error('Failed to ensure guest access:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error ensuring guest access:', error);
      return false;
    }
  };
  
  // Delete image from Supabase Storage
  const deleteImage = async (filePath: string) => {
    try {
      setError(null);
      
      // Check if we have a session, but proceed even if we don't
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('Deleting with auth token:', session.access_token.substring(0, 10) + '...');
      } else {
        console.log('Deleting without authentication');
      }
      
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (deleteError) {
        console.error('Delete error details:', deleteError);
        throw deleteError;
      }
      
      toast.success('Image deleted successfully');
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during deletion'));
      toast.error("Delete failed: " + (err instanceof Error ? err.message : "Unknown error"));
      return false;
    }
  };
  
  // List images in a bucket
  const listImages = async (path?: string) => {
    try {
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('Listing with auth token:', session.access_token.substring(0, 10) + '...');
      } else {
        console.log('Listing without authentication');
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
      toast.error("Failed to list images: " + (err instanceof Error ? err.message : "Unknown error"));
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
