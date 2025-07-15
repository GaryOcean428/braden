import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaLibrary } from '../MediaLibrary';
import { ImageIcon, Upload, Loader2 } from 'lucide-react';
import { LogoPreview } from './LogoPreview';
import { useLogoManager } from './useLogoManager';
import { LogoManagerProps } from './types';
import { MediaItem } from '../types';
import { LogoManagerLoading } from './LogoManagerLoading';
import { LogoManagerError } from './LogoManagerError';

export const LogoManager: React.FC<LogoManagerProps> = ({
  onLogoUpdate,
  currentLogo,
  title = 'Logo Manager',
  description = 'Update your site logo',
  bucketName = 'logos',
}) => {
  const {
    selectedLogo,
    setSelectedLogo,
    isUpdating,
    error,
    loading,
    logoUrl,
    handleUpdateLogo,
    setError,
  } = useLogoManager(onLogoUpdate, currentLogo);

  const handleSelectItem = (item: MediaItem) => {
    setSelectedLogo(item);
  };

  const handleMediaChange = () => {
    console.log('Media library changed');
  };

  if (loading) {
    return <LogoManagerLoading title={title} />;
  }

  if (error) {
    return (
      <LogoManagerError
        title={title}
        error={error}
        onRetry={() => setError(null)}
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-braden-navy text-white">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {logoUrl && <LogoPreview url={logoUrl} title="Current" />}

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
            className="bg-braden-red hover:bg-braden-dark-red"
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
