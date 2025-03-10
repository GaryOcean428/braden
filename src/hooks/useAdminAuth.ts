
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkExistingSession();
  }, []);
  
  const checkExistingSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        // Check if the user is an admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        
        if (!adminError && isAdmin) {
          toast.success('Already authenticated as admin');
          navigate('/admin');
          return;
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      // First authenticate the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Check if the user is an admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        
        if (adminError) {
          console.error('Admin check error:', adminError);
          throw new Error('Could not verify admin status');
        }
        
        if (!isAdmin) {
          // If not an admin, create admin record
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({ user_id: data.user.id });
            
          if (insertError) {
            console.error('Error adding admin user:', insertError);
            if (insertError.code !== '23505') { // Not a duplicate error
              throw insertError;
            }
          }
        }
        
        toast.success('Authentication successful');
        
        // Give a slight delay to allow the auth state to propagate
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
      
      // Sign out on error to clean up state
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isCheckingAuth,
    handleLogin
  };
}
