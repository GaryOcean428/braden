
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { ContentTabs } from "@/components/admin/ContentTabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast: toastUI } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        setAuthError("You must be logged in to access the admin dashboard");
        toast.error("Authentication Required", {
          description: "Please log in to access the admin dashboard"
        });
        navigate('/admin/auth');
        return;
      }
      
      try {
        // Execute RPC to check admin status directly
        const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin');
        
        if (adminCheckError) {
          console.error("Admin check error:", adminCheckError);
          
          // If it's a permission error for admin_users table, try to insert the user as admin
          if (adminCheckError.code === '42501' && adminCheckError.message.includes('admin_users')) {
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert({ user_id: data.session.user.id });
              
            if (!insertError) {
              // Successfully added as admin, continue to dashboard
              setIsLoading(false);
              return;
            }
          }
          
          toast.error("Permission Check Failed", {
            description: "Could not verify admin permissions"
          });
        } else if (!isAdmin) {
          // If not an admin, create admin record
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({ user_id: data.session.user.id });
            
          if (insertError) {
            console.error('Error adding admin user:', insertError);
            if (insertError.code !== '23505') { // Not a duplicate error
              throw insertError;
            }
          } else {
            // Successfully added as admin
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        setAuthError("Failed to verify or set admin status");
        toast.error("Access Error", {
          description: "There was a problem verifying your admin status"
        });
        setTimeout(() => {
          navigate('/admin/auth');
        }, 1500);
        return;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthError("Failed to verify authentication");
    } finally {
      setIsLoading(false);
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <DashboardCards />
      <ContentTabs />
    </div>
  );
};

export default Dashboard;
