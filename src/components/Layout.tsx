import { Suspense } from "react";
import Navigation from "./Navigation";
import { Breadcrumb } from "./Breadcrumb";
import { ErrorBoundary } from "./ErrorBoundary";
import { Loader } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

/**
 * Layout component that wraps the main content of the application
 * Provides consistent structure with navigation, breadcrumbs, and error handling
 * 
 * @component
 * @param {LayoutProps} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} [props.showBreadcrumb=true] - Whether to show the breadcrumb navigation
 * @returns {JSX.Element} Layout component with navigation and content structure
 */
const Layout = ({ children, showBreadcrumb = true }: LayoutProps) => {
  return (
    <div 
      className="min-h-screen bg-background"
      role="main"
    >
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
      >
        Skip to main content
      </a>
      
      <ErrorBoundary>
        <Navigation />
        {showBreadcrumb && <Breadcrumb />}
        <Suspense 
          fallback={
            <div 
              className="flex items-center justify-center min-h-[50vh]"
              role="alert"
              aria-label="Loading content"
            >
              <Loader className="h-8 w-8 animate-spin" aria-hidden="true" />
              <span className="sr-only">Loading content...</span>
            </div>
          }
        >
          <main id="main-content" className="relative z-0">
            {children}
          </main>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;