export interface MediaItem {
  id: string;
  name: string;
  publicUrl: string;
  size: number;
  type: string;
  created_at: string;
}

export interface LogoFile {
  id: string;
  url: string;
  name: string;
  created_at: string;
}

export interface MediaLibraryProps {
  onChange: () => void;
  selectedItem?: MediaItem | null;
  onSelectItem?: (item: MediaItem) => void;
  bucketName?: string;
  title?: string;
}
