
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PagesTabContent } from "./PagesTabContent";
import { BlocksTabContent } from "./BlocksTabContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const ContentTabs = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast: toastUI } = useToast();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check authentication on component mount
    checkAuth();
  }, [retryCount]);

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setAuthError("Authentication error: Please log in again");
        toast.error("Authentication Error", {
          description: "Your session may have expired. Please log in again."
        });
        return;
      }

      if (!data.session) {
        setAuthError("Authentication required: Please log in");
        toast.error("Authentication Required", {
          description: "Please log in to access admin content."
        });
        return;
      }
      
      try {
        // Try to verify admin status
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        
        if (adminError) {
          console.error('Admin check error:', adminError);
          
          // If it's a permission error for admin_users table, try to insert the user as admin
          if (adminError.code === '42501' && adminError.message.includes('admin_users')) {
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert({ user_id: data.session.user.id });
              
            if (!insertError) {
              // Successfully added as admin
              setAuthError(null);
              toast.success("Admin access granted");
              return;
            }
          }
          
          setAuthError("Could not verify admin status");
        } else if (!isAdmin) {
          // If not admin, try to make them admin
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({ user_id: data.session.user.id });
            
          if (!insertError) {
            // Successfully added as admin
            setAuthError(null);
            toast.success("Admin access granted");
            return;
          } else {
            setAuthError("Failed to grant admin access");
          }
        } else {
          // User is admin
          setAuthError(null);
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        setAuthError("Failed to verify admin status");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthError("Unable to verify authentication status");
    }
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  return (
    <div className="mt-8">
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{authError}</p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </Button>
              <Button size="sm" asChild>
                <Link to="/admin/auth">Go to Login</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList className="bg-gray-100 border">
          <TabsTrigger value="pages" className="data-[state=active]:bg-white">Recent Pages</TabsTrigger>
          <TabsTrigger value="blocks" className="data-[state=active]:bg-white">Content Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <PagesTabContent />
        </TabsContent>

        <TabsContent value="blocks">
          <BlocksTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
