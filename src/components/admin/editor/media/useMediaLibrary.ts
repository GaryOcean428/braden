
import { useState, useEffect, useCallback } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { STORAGE_BUCKETS } from '@/integrations/supabase/storage';
import { toast } from 'sonner';
import { MediaItem } from './types';

export const useMediaLibrary = (onChange: () => void, bucketName: string = 'media') => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('images');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Use the appropriate bucket based on parameters
  const { uploadImage, uploading, deleteImage } = useImageUpload(bucketName as any);

  // Function to load media from Supabase
  const loadMedia = useCallback(async () => {
    try {
      console.log(`Loading media from bucket: ${bucketName}`);
      setIsLoading(true);
      setError(null);
      
      // Check auth status before attempting to list files
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        console.warn('No auth session found when loading media');
        setError('Authentication required to access media library');
        setMediaItems([]);
        return;
      }
      
      // List files from the Supabase storage
      console.log(`Listing files from bucket: ${bucketName}`);
      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list();
      
      if (listError) {
        console.error('Error listing files:', listError);
        
        if (listError.message.includes('security policy') || listError.message.includes('permission')) {
          setError('You do not have permission to access this media library');
        } else {
          setError(`Failed to load media: ${listError.message}`);
        }
        
        setMediaItems([]);
        return;
      }
      
      // Handle case where files is null
      if (!files) {
        console.log('No files returned from storage');
        setMediaItems([]);
        return;
      }
      
      console.log(`Found ${files.length} files in bucket ${bucketName}`);
      
      // Filter out folders, only include files
      const fileItems = files
        .filter(item => !item.id.endsWith('/'))
        .map(file => {
          const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(file.name);
          
          return {
            id: file.id,
            name: file.name,
            publicUrl: data.publicUrl,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'unknown',
            created_at: file.created_at || new Date().toISOString()
          };
        });
      
      console.log(`Processed ${fileItems.length} media items`);
      setMediaItems(fileItems);
    } catch (error: any) {
      console.error('Error loading media:', error);
      setError('Failed to load media items');
      setMediaItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [bucketName]);
  
  // Load media when the component mounts or bucket changes
  useEffect(() => {
    loadMedia();
  }, []);
  
  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      console.log(`Uploading file to bucket: ${bucketName}`);
      // Upload the file
      const result = await uploadImage(file);
      
      if (result) {
        toast.success('File uploaded successfully');
        onChange();
        loadMedia();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    }
  };
  
  // Handle media deletion
  const handleDeleteMedia = async (item: MediaItem) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${item.name}?`);
    if (!confirmed) return;
    
    try {
      console.log(`Deleting file from bucket: ${bucketName}`);
      const result = await deleteImage(item.name);
      
      if (result) {
        toast.success('File deleted successfully');
        onChange();
        loadMedia();
        
        if (selectedItem?.id === item.id) {
          setSelectedItem(null);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  // Filter media items by search query
  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    mediaItems: filteredMedia,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    selectedItem,
    setSelectedItem,
    uploading,
    handleFileUpload,
    handleDeleteMedia,
    loadMedia,
    error
  };
};
