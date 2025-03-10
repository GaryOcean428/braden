
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
  const currentYear = new Date().getFullYear();

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
        
        <footer className="py-8 px-6 border-t bg-[#2c3e50] text-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Braden Group</h3>
                <p className="mb-4 text-gray-300">Professional recruiting solutions for apprenticeships and traineeships.</p>
                <p className="text-[#cbb26a] font-semibold">People. Employment. Progress.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="mb-1 text-gray-300">5/339 Cambridge Street,</p>
                <p className="mb-1 text-gray-300">WEMBLEY, WA 6014</p>
                <p className="mb-1 text-gray-300">+61 8 6166 7500</p>
                <p className="text-gray-300">info@braden.com.au</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                  <li><a href="/recruitment" className="text-gray-300 hover:text-white transition-colors">Recruitment</a></li>
                  <li><a href="/apprenticeships" className="text-gray-300 hover:text-white transition-colors">Apprenticeships</a></li>
                  <li><a href="/admin/auth" className="text-gray-300 hover:text-white transition-colors">Developer Login</a></li>
                  <li><a href="/login" className="text-[#cbb26a] hover:text-[#d8c690] transition-colors font-medium">Client Login</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                © {currentYear} Braden Group. All rights reserved.
              </div>
              <div className="text-sm text-gray-400">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a> | 
                <a href="/terms" className="ml-2 hover:text-white transition-colors">Terms of Service</a> |
                <a href="/admin/auth" className="ml-2 hover:text-white transition-colors">Developer Login</a>
              </div>
            </div>
          </div>
        </footer>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
