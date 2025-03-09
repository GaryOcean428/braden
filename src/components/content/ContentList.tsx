
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ContentPage } from "@/integrations/supabase/database.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ContentList() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("content_pages")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setPages(data as ContentPage[]);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Error",
        description: "Failed to load content pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("content_pages")
        .update({ is_published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setPages(pages.map(page => 
        page.id === id ? { ...page, is_published: !currentStatus } : page
      ));

      toast({
        title: "Success",
        description: `Page ${!currentStatus ? "published" : "unpublished"} successfully`,
      });
    } catch (error) {
      console.error("Error updating page status:", error);
      toast({
        title: "Error",
        description: "Failed to update page status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("content_pages")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setPages(pages.filter(page => page.id !== deleteId));
      setDeleteId(null);

      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Pages</h1>
        <Button onClick={() => navigate("/admin/content/edit")}>
          Create New Page
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Loading pages...</div>
      ) : pages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No pages found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first page</p>
          <Button onClick={() => navigate("/admin/content/edit")}>
            Create New Page
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>/{page.slug}</TableCell>
                  <TableCell>
                    <Badge variant={page.is_published ? "default" : "outline"}>
                      {page.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(page.updated_at)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/admin/content/edit/${page.id}`)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant={page.is_published ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleTogglePublish(page.id, page.is_published)}
                    >
                      {page.is_published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setDeleteId(page.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the page and all of its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
