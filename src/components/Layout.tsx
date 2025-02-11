
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { Breadcrumb } from "./Breadcrumb";
import { ErrorBoundary } from "./ErrorBoundary";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

const Layout = ({ children, showBreadcrumb = true }: LayoutProps) => {
  const navigate = useNavigate();

  const handleDevLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/admin/auth');
  };

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
          <div className="container mx-auto flex justify-end">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleDevLogin}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin Login
            </Button>
          </div>
        </footer>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
