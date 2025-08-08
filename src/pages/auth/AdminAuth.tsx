import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AuthLoadingState } from '@/components/auth/AuthLoadingState';
import { AdminLoginForm } from '@/components/auth/AdminLoginForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminAuth = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isCheckingAuth,
    handleLogin,
    error,
  } = useAdminAuth();

  const navigate = useNavigate();

  // Handle logout if user comes to this page while already logged in
  useEffect(() => {
    const logout = async () => {
      console.log('Logging out user...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        toast.error('Error logging out');
      } else {
        console.log('Logout successful');
        toast.success('Logged out successfully');
      }
    };

    // Check URL for logout parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
      logout();
      // Clear the logout parameter from URL
      navigate('/admin/auth', { replace: true });
    }
  }, [navigate]);

  // Check if the server is properly serving the route
  useEffect(() => {
    const checkServerRoute = async () => {
      try {
        const response = await fetch('/admin/auth');
        if (!response.ok) {
          throw new Error('Server is not properly serving the route');
        }
      } catch (error) {
        console.error('Server route check error:', error);
        toast.error('Server route check failed');
      }
    };

    checkServerRoute();
  }, []);

  // Check for misconfiguration in the server settings
  useEffect(() => {
    const checkServerConfig = async () => {
      try {
        const response = await fetch('/api/check-config');
        if (!response.ok) {
          throw new Error('Server configuration error');
        }
      } catch (error) {
        console.error('Server configuration check error:', error);
        toast.error('Server configuration check failed');
      }
    };

    checkServerConfig();
  }, []);

  if (isCheckingAuth) {
    return <AuthLoadingState />;
  }

  return (
    <AdminLoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
      handleLogin={handleLogin}
      error={error}
    />
  );
};

export default AdminAuth;
