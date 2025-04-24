
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkExistingSession();
  }, []);
  
  const checkExistingSession = async () => {
    try {
      setError(null);
      setIsCheckingAuth(true);
      
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session retrieval error:', sessionError);
        setIsCheckingAuth(false);
        return;
      }
      
      if (data.session) {
        // Call RPC function to check developer status
        const { data: isDevData, error: devError } = await supabase
          .rpc('is_developer');
          
        if (devError) {
          console.error('Developer check error:', devError);
          return;
        }
        
        if (isDevData) {
          console.log("Developer access confirmed");
          toast.success('Developer Access Confirmed', {
            description: 'You have full system privileges'
          });
          setIsAdmin(true);
          setIsDeveloper(true);
          navigate('/admin');
        } else {
          // Check regular admin access as fallback
          const { data: adminData, error: adminError } = await supabase
            .rpc('has_admin_access');
            
          if (adminError) {
            console.error('Admin check error:', adminError);
            return;
          }
          
          if (adminData) {
            console.log("Admin access confirmed");
            toast.success('Admin Access Confirmed');
            setIsAdmin(true);
          } else {
            console.log("Standard user access detected");
            setIsAdmin(false);
            setIsDeveloper(false);
          }
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
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });
      
      if (loginError) {
        setError(loginError.message);
        toast.error('Login Failed', {
          description: loginError.message
        });
        return;
      }
      
      if (!data.user) {
        setError('Authentication failed');
        toast.error('Authentication Failed', {
          description: 'User information not available'
        });
        return;
      }
      
      // After successful login, check developer/admin status
      const { data: isDevData } = await supabase.rpc('is_developer');
      
      if (isDevData) {
        toast.success('Developer access confirmed');
        setIsAdmin(true);
        setIsDeveloper(true);
        navigate('/admin');
      } else {
        const { data: adminData } = await supabase.rpc('has_admin_access');
        
        if (adminData) {
          toast.success('Admin access confirmed');
          setIsAdmin(true);
          navigate('/admin');
        } else {
          setError('You do not have admin access');
          toast.error('Access Denied', {
            description: 'You do not have admin privileges'
          });
          await supabase.auth.signOut();
        }
      }
    } catch (error: any) {
      console.error('Login process error:', error);
      setError(error.message || 'An unexpected error occurred');
      toast.error('Login Error', {
        description: 'An unexpected error occurred'
      });
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
    error,
    isAdmin,
    isDeveloper
  };
}
