import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Upload, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  listHeroImages,
  uploadHeroImageWithToast,
  deleteHeroImage,
  type HeroImage
} from '@/services/heroImageService';

interface HeroImageManagerProps {
  onImageSelect?: (image: HeroImage) => void;
  selectedImagePath?: string;
  currentHeroImage?: string;
  onImageUpdate?: (url: string) => void;
}

export const HeroImageManager: React.FC<HeroImageManagerProps> = ({
  onImageSelect,
  selectedImagePath,
  currentHeroImage,
  onImageUpdate
}) => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<HeroImage | null>(null);
  const { user } = useAuth();

  // Check if the user is an admin (developer)
  const isAdmin = user?.email === 'braden.lang77@gmail.com';

  // Load images on mount
  useEffect(() => {
    if (isAdmin) {
      loadImages();
    }
  }, [isAdmin]);

  const loadImages = async () => {
    try {
      setError(null);
      setLoading(true);
      const imageList = await listHeroImages();
      setImages(imageList);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load images';
      setError(message);
      console.error('Failed to load hero images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadHeroImageWithToast(file);
      // Refresh the images list
      await loadImages();
      // Clear the input
      event.target.value = '';
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: HeroImage) => {
    if (!confirm(`Are you sure you want to delete "${image.name}"?`)) return;

    try {
      await deleteHeroImage(image.path);
      toast.success('Image deleted successfully');
      await loadImages();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete image';
      toast.error(message);
      console.error('Delete failed:', err);
    }
  };

  const handleImageSelect = (image: HeroImage) => {
    setSelectedImage(image);
    onImageSelect?.(image);
  };

  const handleUpdateHero = async () => {
    if (!selectedImage || !isAdmin) return;

    try {
      // Here you would typically update a database record or settings
      if (onImageUpdate) {
        onImageUpdate(selectedImage.url);
      }
      toast.success('Hero image updated successfully!');
    } catch (error) {
      toast.error('Failed to update hero image. Please try again.');
      console.error('Error updating hero image:', error);
    }
  };

  // If the user is not an admin, show an access denied message
  if (!isAdmin) {
    return (
      <Alert variant="destructive" className="w-full">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Only developers can access the Hero Image Manager. Please log in with an admin account.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hero Images</CardTitle>
          <CardDescription>Loading images...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Hero Image Manager
          </CardTitle>
          <CardDescription>
            Upload and manage hero images for your pages. Select an image to use as the current hero.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Current Hero Image Display */}
          {currentHeroImage && (
            <div>
              <h3 className="text-lg font-medium mb-2">Current Hero Image</h3>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={currentHeroImage}
                  alt="Current hero image"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          {/* Selected New Image */}
          {selectedImage && (
            <div>
              <h3 className="text-lg font-medium mb-2">Selected New Image</h3>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={selectedImage.url}
                  alt="Selected hero image"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="hero-upload"
            />
            <label
              htmlFor="hero-upload"
              className={`cursor-pointer flex flex-col items-center gap-2 ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {uploading ? 'Uploading...' : 'Click to upload hero image'}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            </label>
          </div>

          {/* Images Grid */}
          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hero images uploaded yet</p>
              <p className="text-sm">Upload your first image above</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.path}
                  className={`relative group border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedImagePath === image.path || selectedImage?.path === image.path
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {(selectedImagePath === image.path || selectedImage?.path === image.path) && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          Selected
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs truncate text-gray-600">
                      {image.name}
                    </p>
                    {image.created_at && (
                      <p className="text-xs text-gray-400">
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              {images.length} images
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadImages}>
                Refresh
              </Button>
              {selectedImage && (
                <Button onClick={handleUpdateHero}>
                  Update Hero Image
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
