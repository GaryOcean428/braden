
import React from 'react';
import { ImageIcon, FileVideo } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaLibrary } from './useMediaLibrary';
import { FileUploader } from './FileUploader';
import { SearchBar } from './SearchBar';
import { ImageGrid } from './ImageGrid';
import { MediaList } from './MediaList';
import { MediaItemDetails } from './MediaItemDetails';
import { MediaLibraryProps } from './types';

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ onChange }) => {
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
    handleDeleteMedia
  } = useMediaLibrary(onChange);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Media Library</h3>
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
            onSelectItem={setSelectedItem}
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
