
import React, { useState, useEffect } from 'react';
import { supabase, STORAGE_BUCKETS } from '@/integrations/supabase/client';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Loader2, 
  Upload, 
  Trash2, 
  Search, 
  Image as ImageIcon, 
  FileImage, 
  FileVideo,
  Pencil
} from 'lucide-react';

interface MediaLibraryProps {
  onChange: () => void;
}

interface MediaItem {
  id: string;
  publicUrl: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ onChange }) => {
  const { uploadImage, uploading, deleteImage } = useImageUpload();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('images');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  
  useEffect(() => {
    loadMedia();
  }, [activeTab]);

  const loadMedia = async () => {
    try {
      setIsLoading(true);

      // Get the appropriate bucket based on active tab
      const bucketName = activeTab === 'images' 
        ? STORAGE_BUCKETS.CONTENT_IMAGES
        : STORAGE_BUCKETS.MEDIA;
      
      // List files from the Supabase storage
      const { data: files = [] } = await supabase.storage
        .from(bucketName)
        .list();
      
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
    } catch (error) {
      console.error('Error loading media:', error);
      toast.error('Failed to load media items');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const bucketName = activeTab === 'images' 
        ? STORAGE_BUCKETS.CONTENT_IMAGES
        : STORAGE_BUCKETS.MEDIA;
        
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
  
  const handleDeleteMedia = async (item: MediaItem) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${item.name}?`);
    if (!confirmed) return;
    
    try {
      const bucketName = activeTab === 'images' 
        ? STORAGE_BUCKETS.CONTENT_IMAGES
        : STORAGE_BUCKETS.MEDIA;
        
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
  
  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Media Library</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline" 
            className="relative"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept={activeTab === 'images' ? 'image/*' : 'image/*,video/*,application/pdf'}
                />
              </>
            )}
          </Button>
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
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-0 aspect-square bg-gray-100 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </CardContent>
                </Card>
              ))
            ) : filteredMedia.length > 0 ? (
              filteredMedia.map(item => (
                <Card 
                  key={item.id}
                  className={`overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-2 ${
                    selectedItem?.id === item.id 
                      ? 'ring-2 ring-[#ab233a] ring-offset-2' 
                      : ''
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-0 relative">
                    <div className="aspect-square">
                      <img
                        src={item.publicUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(item.publicUrl);
                            toast.success("URL copied to clipboard");
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedia(item);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-4 p-8 text-center">
                <FileImage className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">
                  {searchQuery ? 'No images match your search' : 'No images found'}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  {searchQuery ? 'Clear Search' : 'Upload an Image'}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="pt-4">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search all media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#ab233a]" />
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedia.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.type.startsWith('image/') ? (
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                src={item.publicUrl}
                                alt={item.name}
                                className="h-10 w-10 object-cover rounded"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                              <FileVideo className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {Math.round(item.size / 1024)} KB
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(item.publicUrl);
                              toast.success("URL copied to clipboard");
                            }}
                          >
                            Copy URL
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteMedia(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center border rounded-md">
              <FileVideo className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">
                {searchQuery ? 'No media files match your search' : 'No media files found'}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                {searchQuery ? 'Clear Search' : 'Upload Media'}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {selectedItem && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {selectedItem.type.startsWith('image/') ? (
                  <img
                    src={selectedItem.publicUrl}
                    alt={selectedItem.name}
                    className="w-full rounded-md"
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                    <FileVideo className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="md:w-2/3 space-y-4">
                <div>
                  <Label>File Name</Label>
                  <div className="text-lg font-medium">{selectedItem.name}</div>
                </div>
                <div>
                  <Label>URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input 
                      value={selectedItem.publicUrl} 
                      readOnly 
                    />
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedItem.publicUrl);
                        toast.success("URL copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <div>{selectedItem.type}</div>
                  </div>
                  <div>
                    <Label>Size</Label>
                    <div>{Math.round(selectedItem.size / 1024)} KB</div>
                  </div>
                  <div>
                    <Label>Date Added</Label>
                    <div>{new Date(selectedItem.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button 
                    variant="destructive"
                    onClick={() => handleDeleteMedia(selectedItem)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete File
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
