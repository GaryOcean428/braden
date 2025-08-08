import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Upload, AlertCircle } from 'lucide-react';
import { useMediaManagement } from '@/hooks/useMediaManagement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const MediaManager = () => {
  const {
    files,
    loading,
    uploading,
    error,
    loadFiles,
    uploadFile,
    deleteFile,
  } = useMediaManagement();

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Media Library</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={loadFiles}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-6 border-2 border-dashed rounded-lg bg-muted/50">
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <input
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 
                         file:rounded-lg file:border-0 file:text-sm file:font-medium
                         file:bg-primary file:text-primary-foreground
                         hover:file:bg-primary/90"
              />
              {uploading && (
                <div className="mt-4 flex items-center text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div key={file.id} className="relative group">
                <img
                  src={`${supabase.storage.from('media').getPublicUrl(file.file_path).data.publicUrl}`}
                  alt={file.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <span className="text-white text-sm truncate max-w-[80%]">
                    {file.title}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${file.title}?`
                        )
                      ) {
                        deleteFile(file.id, file.file_path);
                      }
                    }}
                    className="h-8 w-8"
                  >
                    <span className="sr-only">Delete</span>
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaManager;
