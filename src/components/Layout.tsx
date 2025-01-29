import { Suspense } from "react";
import Navigation from "./Navigation";
import { Breadcrumb } from "./Breadcrumb";
import { ErrorBoundary } from "./ErrorBoundary";
import { Loader2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

/**
 * Layout component that wraps the main content of the application
 * Provides navigation, breadcrumbs, error boundaries, and loading states
 * @param {LayoutProps} props - Component props
 * @returns {JSX.Element} Layout component
 */
const Layout = ({ children, showBreadcrumb = true }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <Navigation />
        {showBreadcrumb && <Breadcrumb />}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <main className="relative z-0">{children}</main>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;