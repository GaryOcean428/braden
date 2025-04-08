
# SQL Migration for Site Editor

Execute the following SQL commands to set up the necessary tables for the site editor:

```sql
-- Create site_settings table for storing theme, layout, and other customization options
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- e.g., 'theme', 'layout', 'general'
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create page_layouts table for storing layout data
CREATE TABLE IF NOT EXISTS page_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL, -- Can be a route or identifier
  layout_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create custom_components table
CREATE TABLE IF NOT EXISTS custom_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  component_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_components ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Enable read for all users" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Enable write for admin users only" ON site_settings FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Enable update for admin users only" ON site_settings FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Enable delete for admin users only" ON site_settings FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Enable read for all users" ON page_layouts FOR SELECT USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Enable write for admin users only" ON page_layouts FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Enable update for admin users only" ON page_layouts FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Enable delete for admin users only" ON page_layouts FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Enable read for all users" ON custom_components FOR SELECT USING (true);
CREATE POLICY "Enable write for admin users only" ON custom_components FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Enable update for admin users only" ON custom_components FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Enable delete for admin users only" ON custom_components FOR DELETE USING (public.is_admin(auth.uid()));
```
