import Navigation from "./Navigation";
import { Breadcrumb } from "./Breadcrumb";
import { ErrorBoundary } from "./ErrorBoundary";

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

const Layout = ({ children, showBreadcrumb = true }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <Navigation />
        {showBreadcrumb && <Breadcrumb />}
        <main>{children}</main>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;