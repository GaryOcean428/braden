import { Skeleton } from '@/components/ui/skeleton';

export function ContentLoadingState() {
  return (
    <div className="space-y-4" aria-label="Loading content">
      <Skeleton className="h-8 w-full max-w-md" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
