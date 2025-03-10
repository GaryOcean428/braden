
import { usePagesData } from './hooks/usePagesData';
import { PageLoadingState } from './PageLoadingState';
import { PagePermissionError } from './PagePermissionError';
import { PageError } from './PageError';
import { PageList } from './PageList';

export const PagesTabContent = () => {
  const { pages, loading, error, isPermissionError, loadPages } = usePagesData();

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
      <PageList pages={pages} />
    </div>
  );
};
