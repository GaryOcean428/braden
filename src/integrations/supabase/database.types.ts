export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string
          type: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          settings: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_layouts: {
        Row: {
          id: string
          page_id: string
          layout_data: Json
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          layout_data: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          layout_data?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_components: {
        Row: {
          id: string
          name: string
          description: string | null
          component_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          component_data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          component_data?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
