
import { useState, useEffect } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase, STORAGE_BUCKETS } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MediaItem } from './types';

export const useMediaLibrary = (onChange: () => void) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('images');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get the appropriate bucket based on active tab
  const bucketName = activeTab === 'images' 
    ? STORAGE_BUCKETS.CONTENT_IMAGES
    : STORAGE_BUCKETS.MEDIA;
  
  const { uploadImage, uploading, deleteImage } = useImageUpload(bucketName);

  // Load media when tab changes
  useEffect(() => {
    loadMedia();
  }, [activeTab]);

  // Load media from Supabase
  const loadMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check auth status before attempting to list files
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setError('Authentication required to access media library');
        setMediaItems([]);
        return;
      }
      
      // List files from the Supabase storage
      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list();
      
      if (listError) {
        console.error('Error listing files:', listError);
        
        // Check if this is a permissions error
        if (listError.message.includes('security policy') || listError.status === 400) {
          setError('You do not have permission to access this media library');
        } else {
          setError(`Failed to load media: ${listError.message}`);
        }
        
        setMediaItems([]);
        return;
      }
      
      // Handle case where files is null
      if (!files) {
        setMediaItems([]);
        return;
      }
      
      // Filter out folders, only include files
      const fileItems = files.filter(item => !item.id.endsWith('/')).map(file => {
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
      
      setMediaItems(fileItems);
    } catch (error: any) {
      console.error('Error loading media:', error);
      setError('Failed to load media items');
      setMediaItems([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
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
    error
  };
};
