
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export function ContentEmptyState() {
  const navigate = useNavigate();
  
  return (
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
  );
}
