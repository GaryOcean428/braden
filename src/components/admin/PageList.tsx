
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentPage } from "@/integrations/supabase/database.types";
import { Edit, Plus, FileText, ExternalLink } from "lucide-react";

interface PageListProps {
  pages: ContentPage[];
}

export const PageList = ({ pages }: PageListProps) => {
  return (
    <>
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
      
      {pages.length === 0 && (
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
    </>
  );
};
