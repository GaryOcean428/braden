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
      
      console.log("Checking auth status...");
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.log("No session found, redirecting to login");
        setAuthError("You must be logged in to access the admin dashboard");
        toast.error("Authentication Required", {
          description: "Please log in to access the admin dashboard"
        });
        navigate('/admin/auth');
        return;
      }
      
      console.log("User is logged in, checking admin status...");
      
      // Verify if the user is Braden (the developer) by checking email
      const userEmail = data.session.user.email;
      
      if (userEmail !== 'braden.lang77@gmail.com') {
        console.log("User is not an admin");
        setAuthError("You don't have admin permissions");
        toast.error("Permission Denied", {
          description: "You don't have admin permissions"
        });
        // Redirect after a brief delay
        setTimeout(() => {
          navigate('/admin/auth');
        }, 1500);
        return;
      }
      
      console.log("Admin status confirmed via email check");
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
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Skeleton className="h-6 w-2/3 mb-8" />
        <Skeleton className="h-64 w-full rounded-lg" />
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
