
import React, { useEffect } from 'react';
import { ImageIcon, FileVideo, AlertCircle, File, Loader2, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useMediaLibrary } from './useMediaLibrary';
import { FileUploader } from './FileUploader';
import { SearchBar } from './SearchBar';
import { ImageGrid } from './ImageGrid';
import { MediaList } from './MediaList';
import { MediaItemDetails } from './MediaItemDetails';
import { MediaLibraryProps, MediaItem } from './types';

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  onChange, 
  selectedItem: externalSelectedItem, 
  onSelectItem: externalOnSelectItem,
  bucketName = 'media',
  title = 'Media Library'
}) => {
  const {
    mediaItems,
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
    error,
    loadMedia,
    handleRetry
  } = useMediaLibrary(onChange, bucketName);
  
  // Sync with external selection if provided
  useEffect(() => {
    if (externalSelectedItem) {
      setSelectedItem(externalSelectedItem);
    }
  }, [externalSelectedItem, setSelectedItem]);

  // Handle external selection change callback
  const handleSelectItem = (item: MediaItem) => {
    setSelectedItem(item);
    if (externalOnSelectItem) {
      externalOnSelectItem(item);
    }
  };

  useEffect(() => {
    // Load media items when component mounts
    loadMedia();
  }, [bucketName, loadMedia]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#ab233a]" />
        <span className="ml-2 text-[#2c3e50]">Loading media library...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-4">
            <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <FileUploader 
            uploading={uploading}
            onChange={handleFileUpload}
            accept={activeTab === 'images' ? 'image/*' : 'image/*,video/*,application/pdf'}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="images" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-1">
            <FileVideo className="h-4 w-4" />
            All Media
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="pt-4">
          <div className="flex gap-4 mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search images..."
            />
          </div>
          
          <ImageGrid
            isLoading={isLoading}
            items={mediaItems}
            searchQuery={searchQuery}
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
            onDeleteItem={handleDeleteMedia}
            onClearSearch={() => setSearchQuery('')}
          />
        </TabsContent>
        
        <TabsContent value="media" className="pt-4">
          <div className="flex gap-4 mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search all media..."
            />
          </div>
          
          <MediaList
            isLoading={isLoading}
            items={mediaItems}
            searchQuery={searchQuery}
            onDeleteItem={handleDeleteMedia}
            onClearSearch={() => setSearchQuery('')}
          />
        </TabsContent>
      </Tabs>
      
      {selectedItem && (
        <MediaItemDetails item={selectedItem} onDelete={handleDeleteMedia} />
      )}
    </div>
  );
};
