import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RoleManager } from '@/utils/roleManager';
import { NotificationService } from '@/utils/notificationService';

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
        // Use centralized role manager instead of hard-coded checks
        const userRole = await RoleManager.checkUserRole();

        if (userRole.isDeveloper) {
          console.log('Developer access confirmed');
          NotificationService.success('Developer Access Confirmed', {
            description: 'You have full system privileges',
          });
          setIsAdmin(true);
          setIsDeveloper(true);
          navigate('/admin');
          return;
        }

        if (userRole.isAdmin) {
          console.log('Admin access confirmed');
          NotificationService.success('Admin Access Confirmed');
          setIsAdmin(true);
          setIsDeveloper(false);
          navigate('/admin');
          return;
        }

        console.log('Standard user access detected');
        setIsAdmin(false);
        setIsDeveloper(false);
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
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

      if (loginError) {
        setError(loginError.message);
        NotificationService.authError(loginError.message);
        return;
      }

      if (!data.user) {
        setError('Authentication failed');
        NotificationService.authError('User information not available');
        return;
      }

      // Use centralized role manager instead of hard-coded checks
      const userRole = await RoleManager.checkUserRole();

      if (userRole.isDeveloper) {
        NotificationService.success('Developer access confirmed');
        setIsAdmin(true);
        setIsDeveloper(true);
        navigate('/admin');
        return;
      }

      if (userRole.isAdmin) {
        NotificationService.success('Admin access confirmed');
        setIsAdmin(true);
        setIsDeveloper(false);
        navigate('/admin');
        return;
      }

      // No admin access
      setError('You do not have admin access');
      NotificationService.permissionError();
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error('Login process error:', error);
      setError(error.message || 'An unexpected error occurred');
      NotificationService.error('Login Error', {
        description: 'An unexpected error occurred',
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
    isDeveloper,
  };
}
