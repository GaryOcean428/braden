
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaLibrary } from './MediaLibrary';
import { MediaItem } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Image as ImageIcon, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LogoManagerProps {
  onLogoUpdate?: (logoUrl: string) => void;
  currentLogo?: string;
  title?: string;
  description?: string;
  bucketName?: string;
}

export const LogoManager: React.FC<LogoManagerProps> = ({ 
  onLogoUpdate,
  currentLogo, 
  title = "Logo Manager",
  description = "Update your site logo",
  bucketName = "logos"
}) => {
  const [selectedLogo, setSelectedLogo] = useState<MediaItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(currentLogo);
  
  // Load the current logo when component mounts
  useEffect(() => {
    const loadCurrentLogo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check auth status
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          setError('Authentication required to manage branding');
          return;
        }
        
        // In a real app, you'd load the current logo from settings table
        // For now, we'll just use what's passed in props
        setLogoUrl(currentLogo);
      } catch (err: any) {
        console.error('Error loading current logo:', err);
        setError('Failed to load current branding settings');
      } finally {
        setLoading(false);
      }
    };
    
    loadCurrentLogo();
  }, [currentLogo]);
  
  const handleSelectItem = (item: MediaItem) => {
    setSelectedLogo(item);
  };
  
  const handleMediaChange = () => {
    // This will be called when media library changes
    console.log('Media library changed');
  };
  
  const handleUpdateLogo = async () => {
    if (!selectedLogo) return;
    
    try {
      setIsUpdating(true);
      setError(null);
      
      // Here you would typically update site settings in the database
      // For now we'll just call the update callback
      if (onLogoUpdate) {
        onLogoUpdate(selectedLogo.publicUrl);
        setLogoUrl(selectedLogo.publicUrl);
      }
      
      toast.success(`${title} updated successfully!`);
    } catch (err: any) {
      console.error('Error updating logo:', err);
      setError(`Failed to update ${title.toLowerCase()}: ${err.message}`);
      toast.error(`Failed to update ${title.toLowerCase()}`);
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-[#2c3e50] text-white">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => setError(null)}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-[#2c3e50] text-white">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2 text-[#ab233a]" />
            <span>Loading {title.toLowerCase()}...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#2c3e50] text-white">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {logoUrl && (
            <div>
              <h3 className="text-sm font-medium mb-2">Current</h3>
              <div className="border rounded-md p-4 bg-gray-50 flex justify-center">
                <img 
                  src={logoUrl} 
                  alt="Current logo" 
                  className="max-h-32 object-contain"
                />
              </div>
            </div>
          )}
          
          {selectedLogo && (
            <div>
              <h3 className="text-sm font-medium mb-2">Selected</h3>
              <div className="border rounded-md p-4 bg-gray-50 flex justify-center">
                <img 
                  src={selectedLogo.publicUrl} 
                  alt="Selected logo" 
                  className="max-h-32 object-contain"
                />
              </div>
            </div>
          )}
        </div>
        
        <MediaLibrary 
          onChange={handleMediaChange}
          onSelectItem={handleSelectItem}
          selectedItem={selectedLogo}
          bucketName={bucketName}
          title={`Select ${title}`}
        />
        
        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleUpdateLogo} 
            disabled={!selectedLogo || isUpdating}
            className="bg-[#ab233a] hover:bg-[#811a2c]"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Update {title}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
