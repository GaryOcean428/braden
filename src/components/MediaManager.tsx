
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MediaManager = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load images when component mounts
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

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

      const { error: dbError } = await supabase
        .from('media')
        .insert({
          title: file.name,
          file_path: filePath,
          file_type: file.type,
        });

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

      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .match({ id });

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

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden border-0">
      <CardHeader className="bg-[#2c3e50] text-white">
        <CardTitle className="flex justify-between items-center">
          <span>Media Library</span>
          <Button
            onClick={loadImages}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-[#34495e]"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 p-6 border-2 border-dashed border-[#95a5a6] rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
          <Upload className="h-12 w-12 text-[#ab233a] mb-4" />
          <p className="text-sm text-[#2c3e50] mb-4 text-center">
            Drag and drop an image, or click to select
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-[#2c3e50] file:mr-4 file:py-2 file:px-4 
                     file:rounded-lg file:border-0 file:text-white file:bg-[#ab233a] hover:file:bg-[#811a2c]
                     cursor-pointer focus:outline-none"
            disabled={uploading}
          />
          {uploading && (
            <div className="mt-4 flex items-center text-[#95a5a6]">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              <span>Uploading...</span>
            </div>
          )}
          {error && (
            <p className="mt-4 text-sm text-[#ab233a]">{error}</p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-48"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={`${supabase.storage.from('media').getPublicUrl(image.file_path).data.publicUrl}`}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c3e50]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <span className="text-white text-sm truncate max-w-[80%]">{image.title}</span>
                  <Button
                    onClick={() => deleteImage(image.id, image.file_path)}
                    variant="destructive"
                    size="icon"
                    className="bg-[#ab233a] hover:bg-[#811a2c] h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {images.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <p className="text-[#95a5a6]">No images found. Upload some images to get started.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaManager;
