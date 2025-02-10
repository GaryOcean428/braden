
import { Suspense, useState } from "react";
import Navigation from "./Navigation";
import { Breadcrumb } from "./Breadcrumb";
import { ErrorBoundary } from "./ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

const Layout = ({ children, showBreadcrumb = true }: LayoutProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleDevLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'braden.lang77@gmail.com',
        password: 'password123' // This should be changed to a secure password in production
      });
      
      if (error) {
        console.error('Dev login error:', error);
        toast.error('Development login failed: ' + error.message);
      } else {
        toast.success('Development login successful');
      }
    } catch (error) {
      console.error('Dev login error:', error);
      toast.error('Development login failed');
    } finally {
      setIsLoggingIn(false);
    }
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
        
        {/* Dev login button - more prominent in footer */}
        <footer className="py-6 px-6 border-t">
          <div className="container mx-auto flex justify-end">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleDevLogin}
              disabled={isLoggingIn}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLoggingIn ? 'Logging in...' : 'Dev Login'}
            </Button>
          </div>
        </footer>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
