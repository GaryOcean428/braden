
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentPage } from "@/integrations/supabase/database.types";
import { Edit, Trash2, Eye, ExternalLink } from "lucide-react";

interface ContentPagesTableProps {
  pages: ContentPage[];
  onTogglePublish: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export function ContentPagesTable({ pages, onTogglePublish, onDelete }: ContentPagesTableProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
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
                  onClick={() => onTogglePublish(page.id, page.is_published)}
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
                  onClick={() => onDelete(page.id)}
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
  );
}
