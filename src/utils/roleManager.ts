import { supabase } from '@/integrations/supabase/client';
import { AdminRole } from '@/types/permissions';

export interface UserRole {
  isAdmin: boolean;
  isDeveloper: boolean;
  role: AdminRole | null;
}

/**
 * Centralized role management utility to replace hard-coded email checks
 * This provides flexible, role-based access control through the database
 */
export class RoleManager {
  private static readonly DEVELOPER_EMAIL = 'braden.lang77@gmail.com';
  private static readonly DEVELOPER_USER_ID = '9600a18c-c8e3-44ef-83ad-99ede9268e77';

  /**
   * Check if the current user has admin/developer privileges
   * Uses multiple fallback methods for reliability
   */
  static async checkUserRole(): Promise<UserRole> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return { isAdmin: false, isDeveloper: false, role: null };
      }
      
      if (!session) {
        return { isAdmin: false, isDeveloper: false, role: null };
      }

      const userEmail = session.user.email;
      const userId = session.user.id;

      // Primary check: Developer email (for backward compatibility during transition)
      if (userEmail === this.DEVELOPER_EMAIL) {
        console.log('Developer access confirmed by email');
        return { isAdmin: true, isDeveloper: true, role: 'admin' };
      }

      // Secondary check: Developer user ID 
      if (userId === this.DEVELOPER_USER_ID) {
        console.log('Developer access confirmed by user ID');
        return { isAdmin: true, isDeveloper: true, role: 'admin' };
      }

      // Database-based role checks
      const role = await this.checkDatabaseRole(userId);
      if (role) {
        const isAdmin = role === 'admin';
        const isDeveloper = role === 'admin'; // For now, admin = developer
        console.log(`Database role confirmed: ${role}`);
        return { isAdmin, isDeveloper, role };
      }

      // Fallback RPC function checks
      return await this.checkRPCFunctions(userId);

    } catch (error) {
      console.error('Error checking user role:', error);
      return { isAdmin: false, isDeveloper: false, role: null };
    }
  }

  /**
   * Check role via database table
   */
  private static async checkDatabaseRole(userId: string): Promise<AdminRole | null> {
    try {
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error checking admin_users table:', error);
        return null;
      }

      return adminUser?.role as AdminRole || null;
    } catch (error) {
      console.warn('Database role check failed:', error);
      return null;
    }
  }

  /**
   * Check role via RPC functions (fallback)
   */
  private static async checkRPCFunctions(userId: string): Promise<UserRole> {
    try {
      // Check developer admin status
      const { data: isDeveloperAdmin, error: devError } = await supabase.rpc('is_developer_admin');
      
      if (!devError && isDeveloperAdmin === true) {
        console.log('Developer access confirmed by RPC function');
        return { isAdmin: true, isDeveloper: true, role: 'admin' };
      }

      // Check admin_bypass function
      const { data: isBypassAllowed, error: bypassError } = await supabase.rpc('admin_bypass');
      
      if (!bypassError && isBypassAllowed === true) {
        console.log('Admin access confirmed by bypass function');
        return { isAdmin: true, isDeveloper: true, role: 'admin' };
      }

      // Check general admin access
      const { data: hasAdminAccess, error: adminError } = await supabase.rpc('has_admin_access');
      
      if (!adminError && hasAdminAccess === true) {
        console.log('Admin access confirmed by admin function');
        return { isAdmin: true, isDeveloper: false, role: 'admin' };
      }

    } catch (error) {
      console.warn('RPC function checks failed:', error);
    }

    return { isAdmin: false, isDeveloper: false, role: null };
  }

  /**
   * Check if current user is specifically the developer (for high-privilege operations)
   */
  static async isDeveloper(): Promise<boolean> {
    const role = await this.checkUserRole();
    return role.isDeveloper;
  }

  /**
   * Check if current user has admin privileges
   */
  static async isAdmin(): Promise<boolean> {
    const role = await this.checkUserRole();
    return role.isAdmin;
  }

  /**
   * Get the current user's role
   */
  static async getUserRole(): Promise<AdminRole | null> {
    const role = await this.checkUserRole();
    return role.role;
  }
}