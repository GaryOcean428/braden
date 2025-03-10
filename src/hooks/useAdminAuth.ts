
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
        console.log("User is logged in, checking admin status...");
        
        // Skip table operations and use RPC directly
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        
        if (adminError) {
          console.error('Admin check error:', adminError);
          setIsCheckingAuth(false);
          return;
        }
        
        if (isAdmin) {
          console.log("User confirmed as admin via RPC");
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
        // Skip table operations and check if the user is already an admin via RPC
        const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin');
        
        if (adminCheckError) {
          console.error('Admin check error:', adminCheckError);
          setError('Failed to verify admin status');
          return;
        }
        
        if (isAdmin) {
          toast.success('Admin access confirmed');
          setTimeout(() => {
            navigate('/admin');
          }, 500);
        } else {
          setError('You do not have admin access');
          toast.error('Access Denied', {
            description: 'You do not have admin privileges'
          });
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
