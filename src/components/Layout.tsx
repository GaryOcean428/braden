
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { Breadcrumb } from "./Breadcrumb";
import { ErrorBoundary } from "./ErrorBoundary";

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

const Layout = ({ children, showBreadcrumb = true }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-background relative flex flex-col"
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
        <Suspense>
          <main id="main-content" className="relative z-0 flex-grow">
            {children}
          </main>
        </Suspense>
        
        <footer className="py-6 px-6 border-t">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} Braden Group. All rights reserved.
            </div>
            <div className="text-sm text-muted-foreground">
              People. Employment. Progress.
            </div>
          </div>
        </footer>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
