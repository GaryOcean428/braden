
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const PagesTabContent = () => {
  const [pages, setPages] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const { data: pagesData, error: pagesError } = await supabase
        .from('content_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (pagesError) throw pagesError;
      setPages(pagesData || []);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-4">
      {pages.slice(0, 5).map((page) => (
        <Card key={page.id}>
          <CardHeader>
            <CardTitle>{page.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Slug: {page.slug}</p>
            <p className="text-sm text-gray-500">
              Status: {page.is_published ? 'Published' : 'Draft'}
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/admin/content/edit/${page.id}`}>Edit</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {pages.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No pages found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
