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
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session retrieval error:', sessionError);
        setIsCheckingAuth(false);
        return;
      }
      
      if (data.session) {
        const userEmail = data.session.user.email;
        
        if (userEmail === 'braden.lang77@gmail.com') {
          console.log("Primary developer confirmed");
          toast.success('Primary Developer Access Confirmed', {
            description: 'You have full system privileges'
          });
          setIsAdmin(true);
          setIsDeveloper(true);
          navigate('/admin');
        } else {
          console.log("Standard user access detected");
          setIsAdmin(false);
          setIsDeveloper(false);
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
      // Step 1: Authenticate the user
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
      
      // Step 2: Check if the email matches developer's email
      if (data.user.email === 'braden.lang77@gmail.com') {
        // Success path - user is authenticated and is the developer
        toast.success('Developer access confirmed');
        setIsAdmin(true);
        navigate('/admin');
      } else {
        // User is authenticated but not the developer
        setError('You do not have developer access');
        toast.error('Access Denied', {
          description: 'You do not have developer privileges'
        });
        // Sign out since they don't have admin access
        await supabase.auth.signOut();
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
