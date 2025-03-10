
import { ContentList } from "@/components/content/ContentList";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function ContentManager() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Content Management</h1>
        <p className="text-[#2c3e50] mt-2">
          Create and manage content pages for your website.
        </p>
      </div>
      <ErrorBoundary>
        <ContentList />
      </ErrorBoundary>
    </div>
  );
}
