import { Button } from '@/components/ui/button';

interface ContentErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ContentErrorState({ error, onRetry }: ContentErrorStateProps) {
  return (
    <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
      <h3 className="font-medium">Error loading content</h3>
      <p>{error}</p>
      <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}
