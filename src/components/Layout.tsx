
import { Suspense } from "react";
import Navigation from "./Navigation";
import { Breadcrumb } from "./Breadcrumb";
import { ErrorBoundary } from "./ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

const Layout = ({ children, showBreadcrumb = true }: LayoutProps) => {
  const handleDevLogin = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'braden.lang77@gmail.com',
        password: 'password123' // This should be changed to a secure password in production
      });
      
      if (error) {
        console.error('Dev login error:', error);
        toast.error('Development login failed');
      } else {
        toast.success('Development login successful');
      }
    } catch (error) {
      console.error('Dev login error:', error);
      toast.error('Development login failed');
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
        
        {/* Dev login link - very discrete in footer */}
        <footer className="py-6 px-6 text-center">
          <a 
            href="#"
            onClick={handleDevLogin}
            className="text-gray-400 text-sm opacity-20 hover:opacity-60 transition-opacity"
            aria-label="Development access"
          >
            Dev
          </a>
        </footer>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
