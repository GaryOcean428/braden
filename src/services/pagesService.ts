import { supabase } from '@/integrations/supabase/client';

export interface Page {
  id: string;
  slug: string;
  title: string;
  body?: any; // jsonb field
  hero_image?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePageData {
  slug: string;
  title: string;
  body?: any;
  hero_image?: string;
  published?: boolean;
}

export interface UpdatePageData {
  slug?: string;
  title?: string;
  body?: any;
  hero_image?: string;
  published?: boolean;
}

/**
 * Get all pages
 */
export async function getPages(): Promise<Page[]> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch pages: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Get pages error:', error);
    throw error;
  }
}

/**
 * Get a single page by ID
 */
export async function getPage(id: string): Promise<Page | null> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Page not found
      }
      throw new Error(`Failed to fetch page: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Get page error:', error);
    throw error;
  }
}

/**
 * Get a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Page not found
      }
      throw new Error(`Failed to fetch page: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Get page by slug error:', error);
    throw error;
  }
}

/**
 * Create a new page
 */
export async function createPage(pageData: CreatePageData): Promise<Page> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .insert({
        ...pageData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create page: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Create page error:', error);
    throw error;
  }
}

/**
 * Update a page
 */
export async function updatePage(id: string, pageData: UpdatePageData): Promise<Page> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .update({
        ...pageData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update page: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Update page error:', error);
    throw error;
  }
}

/**
 * Delete a page
 */
export async function deletePage(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete page: ${error.message}`);
    }
  } catch (error) {
    console.error('Delete page error:', error);
    throw error;
  }
}

/**
 * Toggle page published status
 */
export async function togglePagePublished(id: string): Promise<Page> {
  try {
    // First get the current page to know the current published status
    const currentPage = await getPage(id);
    if (!currentPage) {
      throw new Error('Page not found');
    }

    // Toggle the published status
    const { data, error } = await supabase
      .from('pages')
      .update({
        published: !currentPage.published,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to toggle page status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Toggle page published error:', error);
    throw error;
  }
}