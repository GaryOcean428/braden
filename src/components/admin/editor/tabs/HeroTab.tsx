import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeroImageManager } from '@/components/admin/HeroImageManager';

interface HeroTabProps {
  /**
   * Callback fired when the hero image has been updated. This can be used
   * to signal that there are unsaved changes in the editor and to re-fetch
   * data if necessary.
   */
  onChange?: () => void;
}

/**
 * The HeroTab wraps the HeroImageManager in a tab-friendly container. It
 * provides a consistent card layout and surfaces an onChange handler so
 * that the parent editor can track modifications. The manager itself
 * handles all of the upload and selection logic via Supabase storage.
 */
export const HeroTab: React.FC<HeroTabProps> = ({ onChange }) => {
  const handleImageUpdate = () => {
    // When the hero image updates we notify the parent so it can mark
    // unsaved changes and/or refresh state.
    if (onChange) {
      onChange();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Image</CardTitle>
        <CardDescription>
          Select and update the hero image displayed on the homepage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HeroImageManager onImageUpdate={handleImageUpdate} />
      </CardContent>
    </Card>
  );
};