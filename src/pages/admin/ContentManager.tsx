
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContentList } from "@/components/content/ContentList";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert } from "lucide-react";

export default function ContentManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast.error("Authentication Required", {
          description: "Please log in to access the admin dashboard"
        });
        navigate('/admin/auth');
        return;
      }
      
      // Execute RPC to check admin status directly
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin');
      
      if (adminCheckError) {
        console.error("Admin check error:", adminCheckError);
        toast.error("Permission Check Failed", {
          description: "Could not verify admin permissions"
        });
      } else if (!isAdmin) {
        setAuthError("You must be an admin to access content management");
        toast.error("Access Denied", {
          description: "You don't have admin permissions"
        });
        
        // Redirect after a brief delay
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
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Skeleton className="h-6 w-2/3 mb-8" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12 bg-amber-50 border-2 border-dashed border-amber-200 rounded-lg">
          <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#ab233a] mb-2">Access Denied</h3>
          <p className="text-[#2c3e50] mb-4">{authError}</p>
          <Button 
            onClick={() => navigate("/admin/auth")}
            className="bg-[#2c3e50] hover:bg-[#34495e]"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Content Management</h1>
        <p className="text-[#2c3e50] mt-2">
          Create and manage content pages for your website.
        </p>
      </div>
      <ErrorBoundary>
        <ContentList />
      </ErrorBoundary>
    </div>
  );
}
