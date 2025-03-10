
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Plus, FileText, ExternalLink, AlertTriangle } from "lucide-react";

export const PagesTabContent = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionError, setIsPermissionError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsPermissionError(false);
      
      const { data: pagesData, error: pagesError } = await supabase
        .from('content_pages')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (pagesError) {
        console.error('Error loading pages:', pagesError);
        
        // Check if it's a permission error
        if (pagesError.message && 
            (pagesError.message.includes('permission') || 
             pagesError.message.includes('denied'))) {
          setIsPermissionError(true);
          setError("You don't have permission to access content pages");
        } else {
          setError(pagesError.message || "Failed to load pages");
        }
        
        setPages([]);
        toast({
          title: "Error",
          description: "Failed to load pages. Please try again.",
          variant: "destructive",
        });
      } else {
        setPages(pagesData || []);
      }
    } catch (error: any) {
      console.error('Error loading pages:', error);
      setError(error.message || "Failed to load pages");
      toast({
        title: "Error",
        description: "Failed to load pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isPermissionError) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <p className="text-[#ab233a] font-medium">Permission Denied</p>
            <p className="text-sm text-[#2c3e50] max-w-md mb-4">
              You don't have permission to access content pages. Try logging in with an admin account.
            </p>
            <Button className="bg-[#2c3e50] hover:bg-[#34495e]" asChild>
              <Link to="/admin/auth">Go to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !isPermissionError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex flex-col gap-2">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-fit mt-2"
            onClick={() => loadPages()}
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Pages</h3>
        <Button size="sm" className="flex items-center gap-1" asChild>
          <Link to="/admin/content/edit">
            <Plus className="h-4 w-4" /> Add Page
          </Link>
        </Button>
      </div>
      
      {pages.map((page) => (
        <Card key={page.id} className="border-gray-200 hover:border-gray-300 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              {page.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-1">Slug: /{page.slug}</p>
            <p className="text-sm text-gray-500 mb-3">
              Status: <span className={page.is_published ? "text-green-600" : "text-amber-600"}>
                {page.is_published ? 'Published' : 'Draft'}
              </span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                <Link to={`/admin/content/edit/${page.id}`}>
                  <Edit className="h-4 w-4" /> Edit
                </Link>
              </Button>
              {page.is_published && (
                <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
                  <Link to={`/${page.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4" /> View
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {pages.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-gray-500 mb-4">No pages found</p>
            <Button size="sm" className="flex items-center gap-1" asChild>
              <Link to="/admin/content/edit">
                <Plus className="h-4 w-4" /> Create First Page
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
      
      {pages.length > 0 && (
        <div className="text-center mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/content">View All Pages</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
