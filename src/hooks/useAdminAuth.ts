
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
        // User is already logged in, check if they're an admin
        console.log("User is logged in, checking admin status...");
        
        try {
          // First try to ensure they are an admin
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({ user_id: data.session.user.id })
            .select();
            
          if (insertError && insertError.code !== '23505') { // Not a duplicate error
            console.log("Failed to add as admin:", insertError);
          } else {
            // Successfully added as admin or already an admin (duplicate error)
            console.log("User is now an admin or was already one");
            toast.success('Authenticated as admin');
            navigate('/admin');
            return;
          }
          
          // Double check with is_admin RPC
          const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
          
          if (adminError) {
            console.error('Admin check error:', adminError);
            // Continue and let the user try to log in again
          } else if (isAdmin) {
            console.log("User confirmed as admin via RPC");
            toast.success('Already authenticated as admin');
            navigate('/admin');
            return;
          }
        } catch (err) {
          console.error('Admin verification error:', err);
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
        console.log("User authenticated, adding as admin...");
        
        // Directly try to insert admin record
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({ user_id: data.user.id })
          .select();
          
        if (insertError && insertError.code !== '23505') { // Not a duplicate error
          console.error('Error adding admin user:', insertError);
          setError('Failed to grant admin access');
        } else {
          // Successfully added as admin or already an admin (duplicate error)
          toast.success('Admin access granted');
          setTimeout(() => {
            navigate('/admin');
          }, 500);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
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
