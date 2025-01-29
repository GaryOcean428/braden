import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image, Trash2, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MediaManager = () => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      
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

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      loadImages();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const deleteImage = async (id: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .match({ id });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          disabled={uploading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={`${supabase.storage.from('media').getPublicUrl(image.file_path).data.publicUrl}`}
              alt={image.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => deleteImage(image.id, image.file_path)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaManager;