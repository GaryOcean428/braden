import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with fallbacks to hardcoded values
const SUPABASE_URL = "https://iykrauzuutvmnxpqppzk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5a3JhdXp1dXR2bW54cHFwcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NzE1NjcsImV4cCI6MjA1MTQ0NzU2N30.kvAGD6FrOhmdpYzRHMyXam3p337w8Ijd5_raruHPd6U";

// Create Supabase client with comprehensive options for auth in SPA
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'braden-auth-token',
    storage: {
      getItem: (key) => {
        try {
          const storedValue = window.localStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
        } catch (error) {
          console.error('Error retrieving auth from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error storing auth in localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing auth from localStorage:', error);
        }
      }
    },
    flowType: 'pkce',
    debug: import.meta.env.MODE !== 'production'
  },
  global: {
    headers: {
      'X-Client-Info': 'braden-website'
    }
  }
});

// Function to create a default admin user if none exists
export const ensureAdminUser = async () => {
  try {
    // Check if we have an active session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Active session found, no need to create admin user');
      return { success: true };
    }
    
    // Try to sign in with default admin credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'Admin123!',
    });
    
    if (error && error.status === 400) {
      // User doesn't exist, create it
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'Admin123!',
        options: {
          data: {
            role: 'admin',
          }
        }
      });
      
      if (signUpError) {
        console.error('Error creating admin user:', signUpError);
        return { success: false, error: signUpError };
      }
      
      console.log('Created default admin user');
      return { success: true, data: signUpData };
    } else if (error) {
      console.error('Error checking for admin user:', error);
      return { success: false, error };
    }
    
    console.log('Signed in with existing admin user');
    return { success: true, data };
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    return { success: false, error };
  }
};
