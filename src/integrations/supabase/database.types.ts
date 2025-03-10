
export type ContentPage = {
  id: string;
  title: string;
  slug: string;
  content: any; // Changed from string to any to accommodate Json type from Supabase
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminUser = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type MediaItem = {
  id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type?: string;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service_type?: string;
  created_at: string;
  updated_at: string;
};

export type ContentBlock = {
  id: string;
  name: string;
  type: string;
  content: any;
  created_at: string;
  updated_at: string;
};
