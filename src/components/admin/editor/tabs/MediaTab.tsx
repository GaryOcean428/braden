
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MediaLibrary } from '@/components/admin/editor/MediaLibrary';

interface MediaTabProps {
  onChange: () => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({ onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Library</CardTitle>
        <CardDescription>
          Manage images, videos, and other media for your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MediaLibrary onChange={onChange} />
      </CardContent>
    </Card>
  );
};
