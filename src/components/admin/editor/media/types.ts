
export interface MediaItem {
  id: string;
  publicUrl: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
}

export interface MediaLibraryProps {
  onChange: () => void;
}
