
import React from 'react';
import { MediaLibrary as NewMediaLibrary } from './media/MediaLibrary';

interface MediaLibraryProps {
  onChange: () => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ onChange }) => {
  return <NewMediaLibrary onChange={onChange} />;
};
