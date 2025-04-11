
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDeleteFile = (bucketName: string) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteFile = async (filePath: string) => {
    try {
      setDeleting(true);
      setError(null);
      
      // Check if we have a session, but proceed even if we don't
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('Deleting with auth token:', session.access_token.substring(0, 10) + '...');
      } else {
        console.log('Deleting without authentication');
      }
      
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (deleteError) {
        console.error('Delete error details:', deleteError);
        throw deleteError;
      }
      
      toast.success('File deleted successfully');
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during deletion'));
      toast.error("Delete failed: " + (err instanceof Error ? err.message : "Unknown error"));
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteFile,
    deleting,
    error
  };
};
