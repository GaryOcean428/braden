import { usePagesData } from './hooks/usePagesData';
import { PageLoadingState } from './PageLoadingState';
import { PagePermissionError } from './PagePermissionError';
import { PageError } from './PageError';
import { PageList } from './PageList';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const PagesTabContent = () => {
  const { pages, loading, error, isPermissionError, loadPages } =
    usePagesData();

  useEffect(() => {
    if (pages.length > 0) {
      toast.success('Database access confirmed', {
        description: 'RLS policies are now correctly configured.',
      });
    }
  }, [pages]);

  if (loading) {
    return <PageLoadingState />;
  }

  if (isPermissionError) {
    return <PagePermissionError />;
  }

  if (error && !isPermissionError) {
    return <PageError error={error} onRetry={loadPages} />;
  }

  return (
    <div className="space-y-4">
      {pages.length > 0 ? (
        <PageList pages={pages} />
      ) : (
        <div className="p-4 text-center bg-gray-50 border rounded-md">
          <p className="text-[#2c3e50]">No content pages found.</p>
          <p className="text-sm text-gray-500 mt-1">
            Pages you create will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
