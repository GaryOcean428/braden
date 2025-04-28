
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaLibrary } from '../MediaLibrary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageIcon, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { LogoPreview } from './LogoPreview';
import { useLogoManager } from './useLogoManager';
import { LogoManagerProps } from './types';
import { MediaItem } from '../types';

export const LogoManager: React.FC<LogoManagerProps> = ({ 
  onLogoUpdate,
  currentLogo, 
  title = "Logo Manager",
  description = "Update your site logo",
  bucketName = "logos"
}) => {
  const {
    selectedLogo,
    setSelectedLogo,
    isUpdating,
    error,
    loading,
    logoUrl,
    handleUpdateLogo
  } = useLogoManager(onLogoUpdate, currentLogo);
  
  const handleSelectItem = (item: MediaItem) => {
    setSelectedLogo(item);
  };
  
  const handleMediaChange = () => {
    console.log('Media library changed');
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
            <LogoPreview url={logoUrl} title="Current" />
          )}
          
          {selectedLogo && (
            <LogoPreview url={selectedLogo.publicUrl} title="Selected" />
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
