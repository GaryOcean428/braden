export interface MediaItem {
  id: string;
  name: string;
  publicUrl: string;
  size: number;
  type: string;
  created_at: string;
}

export interface MediaLibraryProps {
  onChange: () => void;
}

export interface LogoFile {
  id: string;
  name: string;
  publicUrl: string;
  size: number;
  type: string;
  created_at: string;
}

export interface FaviconFile {
  id: string;
  name: string;
  publicUrl: string;
  size: number;
  type: string;
  created_at: string;
}
