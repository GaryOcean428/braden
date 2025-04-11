
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getPublicUrl } from '@/utils/storage';

export interface FileWithUrl {
  id: string;
  name: string;
  publicUrl: string;
  size: number;
  type: string;
  created_at: string;
}

export const useListFiles = (bucketName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const listFiles = async (path?: string): Promise<FileWithUrl[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('Listing with auth token:', session.access_token.substring(0, 10) + '...');
      } else {
        console.log('Listing without authentication');
      }
      
      const { data, error: listError } = await supabase.storage
        .from(bucketName)
        .list(path || '', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (listError) {
        console.error('List error details:', listError);
        throw listError;
      }
      
      if (!data) {
        return [];
      }
      
      // Filter out folders, only include files
      const files = data.filter(item => !item.id.endsWith('/'));
      
      // Map files to include public URLs
      const filesWithUrls = files.map(file => {
        const filePath = path ? `${path}/${file.name}` : file.name;
        const publicUrl = getPublicUrl(bucketName, filePath);
        
        return {
          ...file,
          publicUrl
        };
      });
      
      return filesWithUrls;
    } catch (err) {
      console.error('List error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error listing files'));
      toast.error("Failed to list files: " + (err instanceof Error ? err.message : "Unknown error"));
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    listFiles,
    loading,
    error
  };
};
