
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
      setError(null);
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session retrieval error:', sessionError);
        setIsCheckingAuth(false);
        return;
      }
      
      if (data.session) {
        // Session exists, check admin status using RPC
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_braden_admin');
        
        if (adminError) {
          console.error('Admin check error:', adminError);
          setIsCheckingAuth(false);
          return;
        }
        
        if (isAdmin === true) {
          // User is confirmed as admin
          console.log("User confirmed as admin via is_braden_admin RPC");
          toast.success('Developer access confirmed');
          navigate('/admin');
        } else {
          console.log("User is logged in but not a developer");
          // Sign out if user is not an admin
          await supabase.auth.signOut();
        }
      } else {
        console.log("No active session found");
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
      
      // Step 2: Check admin status using RPC function
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_braden_admin');
      
      if (adminError) {
        console.error('Admin check error:', adminError);
        setError('Failed to verify developer status');
        toast.error('Verification Error', {
          description: 'Failed to verify developer status'
        });
        // Sign out if we can't verify admin status
        await supabase.auth.signOut();
        return;
      }
      
      if (isAdmin === true) {
        // Success path - user is authenticated and is an admin
        toast.success('Developer access confirmed');
        navigate('/admin');
      } else {
        // User is authenticated but not an admin
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
    error
  };
}
