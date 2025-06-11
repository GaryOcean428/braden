import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PagesTabContent } from "./PagesTabContent";
import { BlocksTabContent } from "./BlocksTabContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { RoleManager } from "@/utils/roleManager";
import { NotificationService } from "@/utils/notificationService";

export const ContentManager = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
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
        NotificationService.authError("Your session may have expired. Please log in again.", {
          retry: handleRetry
        });
        return;
      }

      if (!data.session) {
        setAuthError("Authentication required: Please log in");
        NotificationService.authError("Please log in to access admin content.");
        return;
      }
      
      // Use centralized role manager instead of hard-coded email check
      const userRole = await RoleManager.checkUserRole();
      
      if (!userRole.isDeveloper) {
        setAuthError("You don't have developer access");
        NotificationService.permissionError("developer features");
      } else {
        // User has developer access
        setAuthError(null);
        setShowSuccess(true);
        
        NotificationService.success("Authentication successful", {
          description: "You have developer access to content management features."
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthError("Unable to verify authentication status");
      NotificationService.networkError("verify authentication", handleRetry);
    }
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  return (
    <div className="mt-8">
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
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
      
      {showSuccess && (
        <Alert variant="default" className="mb-4 border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Authentication Successful</AlertTitle>
          <AlertDescription className="text-green-600">
            You have developer access to content management features.
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
