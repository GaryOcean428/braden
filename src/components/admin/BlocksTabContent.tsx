
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export const BlocksTabContent = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      const { data: blocksData, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .order('created_at', { ascending: false });

      if (blocksError) throw blocksError;
      setBlocks(blocksData || []);
    } catch (error) {
      console.error('Error loading blocks:', error);
      toast({
        title: "Error",
        description: "Failed to load content blocks",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-4">
      {blocks.map((block) => (
        <Card key={block.id}>
          <CardHeader>
            <CardTitle>{block.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Type: {block.type}</p>
          </CardContent>
        </Card>
      ))}
      {blocks.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No content blocks found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
