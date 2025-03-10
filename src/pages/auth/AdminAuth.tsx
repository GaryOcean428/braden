
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkExistingSession();
  }, []);
  
  const checkExistingSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        // Check if the user is an admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        
        if (!adminError && isAdmin) {
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
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      // First authenticate the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Check if the user is an admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        
        if (adminError) {
          console.error('Admin check error:', adminError);
          throw new Error('Could not verify admin status');
        }
        
        if (!isAdmin) {
          // If not an admin, create admin record
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({ user_id: data.user.id });
            
          if (insertError) {
            console.error('Error adding admin user:', insertError);
            if (insertError.code !== '23505') { // Not a duplicate error
              throw insertError;
            }
          }
        }
        
        toast.success('Authentication successful');
        
        // Give a slight delay to allow the auth state to propagate
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
      
      // Sign out on error to clean up state
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isCheckingAuth) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <div className="h-8 w-8 border-4 border-t-[#ab233a] border-b-[#ab233a] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-center mt-4">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[#ab233a]">Developer Login</CardTitle>
          <CardDescription>Please login with your admin credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                required 
                disabled={isLoading} 
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                required 
                disabled={isLoading} 
                autoComplete="current-password"
              />
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-100 text-sm text-blue-800 flex items-start">
              <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500 mt-0.5" />
              <span>
                Upon login, your account will automatically be granted admin permissions for this demo.
              </span>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#ab233a] hover:bg-[#811a2c]" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
