import React, { useState } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { STORAGE_BUCKETS } from '@/integrations/supabase/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageManager } from '@/components/admin/ImageManager';
import { initializeStorageBuckets } from '@/integrations/supabase/storage';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface HeroImageManagerProps {
  currentHeroImage?: string;
  onImageUpdate?: (url: string) => void;
}

export const HeroImageManager: React.FC<HeroImageManagerProps> = ({
  currentHeroImage = '/hero-image.jpg',
  onImageUpdate
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Check if the user is an admin (developer)
  const isAdmin = user?.email === 'braden.lang77@gmail.com';

  const handleImageSelect = (url: string) => {
    setSelectedImage(url);
  };

  const handleUpdateHero = async () => {
    if (!selectedImage || !isAdmin) return;
    
    try {
      setIsUpdating(true);
      setUpdateSuccess(false);
      setUpdateError(null);
      
      // Initialize storage buckets if they don't exist
      await initializeStorageBuckets();
      
      // Here you would typically update a database record or settings
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onImageUpdate) {
        onImageUpdate(selectedImage);
      }
      
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateError('Failed to update hero image. Please try again.');
      console.error('Error updating hero image:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // If the user is not an admin, show an access denied message
  if (!isAdmin) {
    return (
      <Alert variant="destructive" className="w-full">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Only developers can access the Hero Image Manager.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Hero Image Manager</CardTitle>
          <CardDescription>
            Update the hero image displayed on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            {selectedImage && (
              <div>
                <h3 className="text-lg font-medium mb-2">Selected New Image</h3>
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={selectedImage} 
                    alt="Selected hero image" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          <ImageManager 
            bucketName={STORAGE_BUCKETS.HERO_IMAGES}
            onImageSelect={handleImageSelect}
            title="Select Hero Image"
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleUpdateHero} 
              disabled={!selectedImage || isUpdating}
              className="w-full md:w-auto"
            >
              {isUpdating ? 'Updating...' : 'Update Hero Image'}
            </Button>
          </div>
          
          {updateSuccess && (
            <p className="text-green-600 text-sm">
              Hero image updated successfully!
            </p>
          )}
          
          {updateError && (
            <p className="text-red-600 text-sm">
              {updateError}
            </p>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
