import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PagesTabContent } from "./PagesTabContent";
import { BlocksTabContent } from "./BlocksTabContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { checkAdminAuth } from "@/lib/auth";

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
      const authResult = await checkAdminAuth();
      
      if (authResult.error) {
        setAuthError(authResult.error);
        toast.error("Authentication Error", {
          description: authResult.error
        });
        return;
      }

      if (!authResult.isAuthenticated) {
        setAuthError("Authentication required: Please log in");
        toast.error("Authentication Required", {
          description: "Please log in to access admin content."
        });
        return;
      }
      
      if (!authResult.isAdmin) {
        setAuthError("You don't have admin access");
        toast.error("Access Denied", {
          description: "Admin permissions required to access these features"
        });
        return;
      }

      // User is authenticated and has admin access
      setAuthError(null);
      console.log('Admin access confirmed for user:', authResult.user.email);
      
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthError("Unable to verify authentication status");
      toast.error("Authentication Error", {
        description: "Unable to verify authentication status"
      });
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
          <TabsTrigger value="manage-pages" className="data-[state=active]:bg-white">Manage Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <PagesTabContent />
        </TabsContent>

        <TabsContent value="blocks">
          <BlocksTabContent />
        </TabsContent>

        <TabsContent value="manage-pages">
          <div className="space-y-4">
            <Button variant="default" onClick={() => console.log("Add Page")}>
              Add Page
            </Button>
            <Button variant="default" onClick={() => console.log("Edit Page")}>
              Edit Page
            </Button>
            <Button variant="default" onClick={() => console.log("Delete Page")}>
              Delete Page
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
