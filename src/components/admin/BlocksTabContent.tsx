
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Plus, FileText } from "lucide-react";

export const BlocksTabContent = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: blocksData, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .order('created_at', { ascending: false });

      if (blocksError) throw blocksError;
      setBlocks(blocksData || []);
    } catch (error: any) {
      console.error('Error loading blocks:', error);
      setError(error.message || "Failed to load content blocks");
      toast({
        title: "Error",
        description: "Failed to load content blocks",
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

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex flex-col gap-2">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-fit mt-2"
            onClick={() => loadBlocks()}
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
        <h3 className="text-lg font-medium">Content Blocks</h3>
        <Button size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Block
        </Button>
      </div>
      
      {blocks.map((block) => (
        <Card key={block.id} className="border-gray-200 hover:border-gray-300 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              {block.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Type: {block.type}</p>
            <Button variant="ghost" size="sm" className="mt-2 hover:bg-gray-100">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </CardContent>
        </Card>
      ))}
      
      {blocks.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-gray-500 mb-4">No content blocks found</p>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Create First Block
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
