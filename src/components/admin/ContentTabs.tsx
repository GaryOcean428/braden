
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PagesTabContent } from "./PagesTabContent";
import { BlocksTabContent } from "./BlocksTabContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ContentTabs = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication on component mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setAuthError("Authentication error: Please log in again");
        toast({
          title: "Authentication Error",
          description: "Your session may have expired. Please log in again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthError("Unable to verify authentication status");
    }
  };

  return (
    <div className="mt-8">
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
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
