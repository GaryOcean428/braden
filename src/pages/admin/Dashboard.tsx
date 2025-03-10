
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { ContentTabs } from "@/components/admin/ContentTabs";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        setAuthError("You must be logged in to access the admin dashboard");
        toast.error("Authentication Required", {
          description: "Please log in to access the admin dashboard"
        });
        navigate('/admin/auth');
        return;
      }
      
      // Store user ID for reference
      const userId = data.session.user.id;
      
      // Execute RPC to check admin status directly
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin');
      
      if (adminCheckError) {
        console.error("Admin check error:", adminCheckError);
        
        // Try to create an admin user record
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({ user_id: userId });
          
        if (insertError) {
          console.error("Error creating admin user:", insertError);
          
          // If not a duplicate error
          if (insertError.code !== '23505') {
            setAuthError("Failed to verify or set admin status");
            toast.error("Permission Error", {
              description: "Could not verify admin permissions"
            });
            // Redirect after a brief delay
            setTimeout(() => {
              navigate('/admin/auth');
            }, 1500);
            return;
          }
        } else {
          toast.success("Admin access granted");
        }
      } else if (!isAdmin) {
        // Try to create an admin user record
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({ user_id: userId });
          
        if (insertError) {
          console.error("Error creating admin user:", insertError);
          
          // If not a duplicate error
          if (insertError.code !== '23505') {
            setAuthError("Failed to verify or set admin status");
            toast.error("Permission Error", {
              description: "Could not grant admin permissions"
            });
            // Redirect after a brief delay
            setTimeout(() => {
              navigate('/admin/auth');
            }, 1500);
            return;
          }
        } else {
          toast.success("Admin access granted");
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthError("Failed to verify authentication");
      // Redirect after a brief delay
      setTimeout(() => {
        navigate('/admin/auth');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/admin/auth?logout=true');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-10 w-52 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{authError}</p>
            <Button onClick={() => navigate('/admin/auth')}>Go to Login</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button 
          variant="outline" 
          className="border-[#ab233a] text-[#ab233a] hover:bg-[#ab233a] hover:text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <DashboardCards />
      <ContentTabs />
    </div>
  );
};

export default Dashboard;
