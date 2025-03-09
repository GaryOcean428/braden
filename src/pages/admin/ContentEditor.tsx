
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/content/ContentForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AdminUser } from "@/integrations/supabase/database.types";

export default function ContentEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin/auth');
      return;
    }

    try {
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !adminData) {
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
      toast({
        title: "Error",
        description: "Could not verify admin status",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
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
  );
}
