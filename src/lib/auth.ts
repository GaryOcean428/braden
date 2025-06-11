import { supabase } from '@/integrations/supabase/client';

export interface AuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
  error?: string;
}

/**
 * Check if user is authenticated and has admin access
 * Uses the RLS function to check admin status properly
 */
export const checkAdminAuth = async (): Promise<AuthResult> => {
  try {
    // First check if we have a session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: 'Authentication error: Please log in again'
      };
    }

    if (!sessionData.session) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: 'Authentication required: Please log in'
      };
    }

    const user = sessionData.session.user;
    
    // Use the RLS function to check admin status
    const { data: isAdminData, error: adminError } = await supabase
      .rpc('is_developer_admin');
    
    if (adminError) {
      console.error('Admin check error:', adminError);
      // Fallback to email check if RLS function fails
      const isAdminByEmail = user.email === 'braden.lang77@gmail.com';
      
      if (isAdminByEmail) {
        console.warn('Using email fallback for admin check');
        return {
          isAuthenticated: true,
          isAdmin: true,
          user,
          error: null
        };
      }
      
      return {
        isAuthenticated: true,
        isAdmin: false,
        user,
        error: 'Unable to verify admin permissions'
      };
    }

    return {
      isAuthenticated: true,
      isAdmin: isAdminData === true,
      user,
      error: null
    };
    
  } catch (error) {
    console.error('Auth check failed:', error);
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: 'Unable to verify authentication status'
    };
  }
};

/**
 * Simplified auth check for components that just need to know if user is authenticated
 */
export const checkAuth = async (): Promise<{ isAuthenticated: boolean; user: any; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'Authentication error: Please log in again'
      };
    }

    return {
      isAuthenticated: !!data.session,
      user: data.session?.user || null,
      error: data.session ? null : 'Authentication required: Please log in'
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      error: 'Unable to verify authentication status'
    };
  }
};