
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentPage } from "@/integrations/supabase/database.types";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
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
import { FileText, Plus, Edit, Trash2, Eye, ExternalLink } from "lucide-react";

export function ContentList() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("content_pages")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setPages(data as ContentPage[]);
    } catch (error: any) {
      console.error("Error fetching pages:", error);
      setError(error.message || "Failed to load content pages");
      toast.error("Error", {
        description: "Failed to load content pages"
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

      // Update the local state
      setPages(pages.map(page => 
        page.id === id ? { ...page, is_published: !currentStatus } : page
      ));

      toast.success(!currentStatus ? "Page published" : "Page unpublished", {
        description: `Page has been ${!currentStatus ? "published" : "unpublished"} successfully`
      });
    } catch (error) {
      console.error("Error updating page status:", error);
      toast.error("Error", {
        description: "Failed to update page status"
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      
      const { error } = await supabase
        .from("content_pages")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      // Update the local state
      setPages(pages.filter(page => page.id !== deleteId));
      setDeleteId(null);

      toast.success("Page deleted", {
        description: "Page has been deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Error", {
        description: "Failed to delete page"
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 border border-red-200 bg-red-50 rounded-lg">
        <div className="text-[#ab233a] mb-4">{error}</div>
        <Button 
          onClick={fetchPages}
          className="bg-[#2c3e50] hover:bg-[#34495e]"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#811a2c]">Pages</h2>
          <Button 
            onClick={() => navigate("/admin/content/edit")}
            className="bg-[#2c3e50] hover:bg-[#34495e]"
          >
            <Plus className="h-4 w-4 mr-2" /> Create New Page
          </Button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
            <FileText className="h-12 w-12 text-[#95a5a6] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c3e50] mb-2">No pages found</h3>
            <p className="text-[#95a5a6] mb-4">Get started by creating your first page</p>
            <Button 
              onClick={() => navigate("/admin/content/edit")}
              className="bg-[#ab233a] hover:bg-[#811a2c]"
            >
              <Plus className="h-4 w-4 mr-2" /> Create New Page
            </Button>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-[#2c3e50] font-semibold">Title</TableHead>
                  <TableHead className="text-[#2c3e50] font-semibold">Slug</TableHead>
                  <TableHead className="text-[#2c3e50] font-semibold">Status</TableHead>
                  <TableHead className="text-[#2c3e50] font-semibold">Last Updated</TableHead>
                  <TableHead className="text-right text-[#2c3e50] font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-[#2c3e50]">{page.title}</TableCell>
                    <TableCell className="text-[#3498db]">/{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant={page.is_published ? "default" : "outline"} className={
                        page.is_published ? "bg-[#27ae60] hover:bg-[#27ae60]" : "text-[#95a5a6] border-[#95a5a6]"
                      }>
                        {page.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#2c3e50]">{formatDate(page.updated_at)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/content/edit/${page.id}`)}
                        className="border-[#cbb26a] text-[#2c3e50] hover:bg-[#d8c690] hover:text-[#2c3e50]"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant={page.is_published ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleTogglePublish(page.id, page.is_published)}
                        className={
                          page.is_published 
                            ? "border-[#95a5a6] text-[#2c3e50] hover:bg-[#95a5a6] hover:text-white" 
                            : "bg-[#3498db] hover:bg-[#2980b9] text-white"
                        }
                      >
                        {page.is_published ? <Eye className="h-4 w-4 mr-1" /> : <ExternalLink className="h-4 w-4 mr-1" />}
                        {page.is_published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setDeleteId(page.id)}
                        className="bg-[#ab233a] hover:bg-[#811a2c]"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
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
              <AlertDialogTitle className="text-[#ab233a]">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the page and all of its content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting} className="border-[#95a5a6] text-[#2c3e50]">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={deleting}
                className={`bg-[#ab233a] hover:bg-[#811a2c] ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
}
