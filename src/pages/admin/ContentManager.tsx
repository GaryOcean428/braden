
import { ContentList } from "@/components/content/ContentList";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function ContentManager() {
  return (
    <div className="container mx-auto py-8 px-4">
      <ErrorBoundary>
        <ContentList />
      </ErrorBoundary>
    </div>
  );
}
