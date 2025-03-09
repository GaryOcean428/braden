
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/content/ContentForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AdminUser } from "@/integrations/supabase/database.types";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContentEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        navigate('/admin/auth');
        return;
      }

      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      if (!adminData) {
        toast({
          title: "Access Denied",
          description: "You must be an admin to access this page",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setAuthError("Could not verify admin status");
      toast({
        title: "Error",
        description: "Could not verify admin status",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full max-w-md" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-medium text-red-800">Authentication Error</h2>
          <p className="text-red-700 mt-2">{authError}</p>
          <div className="mt-4">
            <Button onClick={() => navigate('/admin/auth')}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {id ? "Edit Page" : "Create New Page"}
          </h1>
          <Button variant="outline" onClick={() => navigate("/admin/content")}>
            Back to Pages
          </Button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <ContentForm 
            contentId={id} 
            onSuccess={() => navigate("/admin/content")}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
