import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AuthLoadingState } from '@/components/auth/AuthLoadingState';
import { AdminLoginForm } from '@/components/auth/AdminLoginForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminAuth = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isCheckingAuth,
    handleLogin,
    error
  } = useAdminAuth();
  
  const navigate = useNavigate();
  
  // Handle logout if user comes to this page while already logged in
  useEffect(() => {
    const logout = async () => {
      console.log("Logging out user...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        toast.error('Error logging out');
      } else {
        console.log("Logout successful");
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
