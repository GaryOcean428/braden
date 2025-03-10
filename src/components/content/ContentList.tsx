
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useContentPages } from "./hooks/useContentPages";
import { ContentPagesTable } from "./ContentPagesTable";
import { ContentEmptyState } from "./ContentEmptyState";
import { DeletePageDialog } from "./DeletePageDialog";
import { ContentErrorState } from "./ContentErrorState";

export function ContentList() {
  const navigate = useNavigate();
  const {
    pages,
    loading,
    error,
    deleteId,
    deleting,
    setDeleteId,
    fetchPages,
    handleTogglePublish,
    handleDelete
  } = useContentPages();

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
    return <ContentErrorState error={error} onRetry={fetchPages} />;
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
          <ContentEmptyState />
        ) : (
          <ContentPagesTable 
            pages={pages} 
            onTogglePublish={handleTogglePublish} 
            onDelete={setDeleteId} 
          />
        )}

        <DeletePageDialog 
          open={!!deleteId} 
          deleting={deleting}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={handleDelete}
        />
      </div>
    </ErrorBoundary>
  );
}
