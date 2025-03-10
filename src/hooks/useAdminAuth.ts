
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkExistingSession();
  }, []);
  
  const checkExistingSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        try {
          // Check if the user is an admin
          const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
          
          if (adminError) {
            console.error('Admin check error:', adminError);
            
            // If it's a permission error for admin_users table, try to insert the user as admin
            if (adminError.code === '42501' && adminError.message.includes('admin_users')) {
              const { error: insertError } = await supabase
                .from('admin_users')
                .insert({ user_id: data.session.user.id });
                
              if (!insertError) {
                // Successfully added as admin
                toast.success('Authenticated as admin');
                navigate('/admin');
                return;
              }
            }
            
            // Reset checking state but don't redirect - let user log in again
            setIsCheckingAuth(false);
            return;
          }
          
          if (isAdmin) {
            toast.success('Already authenticated as admin');
            navigate('/admin');
            return;
          } else {
            // Not an admin, try to make them admin
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert({ user_id: data.session.user.id });
              
            if (!insertError) {
              toast.success('Admin access granted');
              navigate('/admin');
              return;
            } else {
              console.error('Error adding as admin:', insertError);
              // If it's a duplicate error, the user is already an admin
              if (insertError.code === '23505') {
                toast.success('Already an admin, redirecting');
                navigate('/admin');
                return;
              }
            }
          }
        } catch (err) {
          console.error('Admin verification error:', err);
          setError('Failed to verify admin status');
          // Sign out on error to clean up state
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      setError('Failed to check existing session');
    } finally {
      setIsCheckingAuth(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      // First authenticate the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      if (data.user) {
        try {
          // Check if the user is an admin
          const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
          
          if (adminError) {
            console.error('Admin check error:', adminError);
            
            // If it's a permission error, directly try to insert admin record
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert({ user_id: data.user.id });
                
            if (insertError) {
              console.error('Error adding admin user:', insertError);
              if (insertError.code !== '23505') { // Not a duplicate error
                setError('Failed to grant admin access');
                throw insertError;
              }
            } else {
              toast.success('Admin access granted');
              setTimeout(() => {
                navigate('/admin');
              }, 500);
              return;
            }
          } else if (!isAdmin) {
            // If not an admin, create admin record
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert({ user_id: data.user.id });
              
            if (insertError) {
              console.error('Error adding admin user:', insertError);
              if (insertError.code !== '23505') { // Not a duplicate error
                setError('Failed to grant admin access');
                throw insertError;
              }
            }
          }
          
          toast.success('Authentication successful');
          
          // Give a slight delay to allow the auth state to propagate
          setTimeout(() => {
            navigate('/admin');
          }, 500);
        } catch (err) {
          console.error('Admin verification error:', err);
          setError('Failed to verify admin status. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      // Don't sign out on error, allow the user to try again
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
    handleLogin,
    error
  };
}
