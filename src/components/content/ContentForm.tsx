import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ContentFormFields } from './ContentFormFields';
import { ContentLoadingState } from './ContentLoadingState';
import { ContentErrorState } from './ContentErrorState';
import { useContentForm } from './hooks/useContentForm';

interface ContentFormProps {
  contentId?: string;
  onSuccess?: () => void;
}

export function ContentForm({ contentId, onSuccess }: ContentFormProps) {
  const {
    form,
    loading,
    initialLoading,
    loadError,
    onSubmit,
    loadContentPage,
  } = useContentForm({ contentId, onSuccess });

  if (initialLoading) {
    return <ContentLoadingState />;
  }

  if (loadError) {
    return (
      <ContentErrorState
        error={loadError}
        onRetry={() => contentId && loadContentPage(contentId)}
      />
    );
  }

  return (
    <ErrorBoundary>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ContentFormFields form={form} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : contentId ? 'Update Page' : 'Create Page'}
        </Button>
      </form>
    </ErrorBoundary>
  );
}
