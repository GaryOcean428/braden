
export type ContentPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
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
