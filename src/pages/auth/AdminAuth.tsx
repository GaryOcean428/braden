
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AuthLoadingState } from '@/components/auth/AuthLoadingState';
import { AdminLoginForm } from '@/components/auth/AdminLoginForm';

const AdminAuth = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isCheckingAuth,
    handleLogin
  } = useAdminAuth();
  
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
    />
  );
};

export default AdminAuth;
