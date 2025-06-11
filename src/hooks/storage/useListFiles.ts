
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getPublicUrl } from '@/utils/storage';
import { StorageBucketName } from '@/integrations/supabase/storage';

export interface FileWithUrl {
  id: string;
  name: string;
  publicUrl: string;
  size: number;
  type: string;
  created_at: string;
}

export const useListFiles = (bucketName: StorageBucketName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const listFiles = async (path?: string): Promise<FileWithUrl[]> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Listing files from bucket: ${bucketName}${path ? ` at path: ${path}` : ''}`);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('Listing with authenticated user:', session.user.email);
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
        console.error('List error code:', listError.statusCode);
        console.error('List error message:', listError.message);
        
        // Provide more specific error messages
        if (listError.message.includes('row level security') || 
            listError.message.includes('permission denied')) {
          console.error('Permission denied when listing files');
          toast.error('Permission Error', {
            description: 'You do not have permission to view files in this bucket.'
          });
        } else if (listError.message.includes('bucket')) {
          console.error('Bucket not found or inaccessible');
          toast.error('Bucket Error', {
            description: 'The storage bucket could not be accessed.'
          });
        } else {
          toast.error("Failed to list files", {
            description: listError.message || "Unknown error"
          });
        }
        throw listError;
      }
      
      if (!data) {
        console.log('No files found in bucket');
        return [];
      }
      
      console.log(`Found ${data.length} items in bucket ${bucketName}`);
      
      // Filter out folders, only include files
      const files = data.filter(item => !item.id.endsWith('/') && item.name);
      console.log(`Filtered to ${files.length} actual files`);
      
      // Map files to include public URLs and extract size and type from metadata
      const filesWithUrls: FileWithUrl[] = files.map(file => {
        const filePath = path ? `${path}/${file.name}` : file.name;
        const publicUrl = getPublicUrl(bucketName, filePath);
        
        // Extract size and type from metadata, or use default values if not available
        const size = file.metadata?.size || 0;
        const type = file.metadata?.mimetype || 'unknown';
        
        console.log(`Processed file: ${file.name}, URL: ${publicUrl}`);
        
        return {
          id: file.id,
          name: file.name,
          publicUrl,
          size,
          type,
          created_at: file.created_at || new Date().toISOString()
        };
      });
      
      console.log(`Successfully processed ${filesWithUrls.length} files with URLs`);
      return filesWithUrls;
    } catch (err) {
      console.error('List error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error listing files'));
      
      // Only show error toast if we haven't already shown one
      if (!err?.message?.includes('Permission Error') && 
          !err?.message?.includes('Bucket Error')) {
        toast.error("Failed to list files", {
          description: err instanceof Error ? err.message : "Unknown error"
        });
      }
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
