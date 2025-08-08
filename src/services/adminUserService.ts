import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

/**
 * Check if the current user is a developer admin
 */
export async function isDeveloperAdmin(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session?.user?.email) {
      return false;
    }

    // Check if user email exists in admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', data.session.user.email)
      .single();

    if (adminError) {
      console.error('Error checking admin status:', adminError);
      return false;
    }

    return !!adminData;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

/**
 * Get all admin users
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch admin users: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Get admin users error:', error);
    throw error;
  }
}

/**
 * Add an admin user by email (requires service role)
 * This should be called server-side with service role permissions
 */
export async function addAdminUser(email: string): Promise<AdminUser> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .insert({ email })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add admin user: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Add admin user error:', error);
    throw error;
  }
}

/**
 * Remove an admin user
 */
export async function removeAdminUser(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to remove admin user: ${error.message}`);
    }
  } catch (error) {
    console.error('Remove admin user error:', error);
    throw error;
  }
}