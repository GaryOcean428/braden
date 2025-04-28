
export interface LogoFile {
  id: string;
  name: string;
  publicUrl: string;
  created_at: string;
}

export interface LogoManagerProps {
  onLogoUpdate?: (logoUrl: string) => void;
  currentLogo?: string;
  title?: string;
  description?: string;
  bucketName?: string;
}

export interface LogoPreviewProps {
  url?: string;
  title: string;
  className?: string;
}
