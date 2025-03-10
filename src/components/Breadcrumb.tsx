import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  return <nav aria-label="Breadcrumb" className="py-2 px-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 bg-[811a2c]">
        <li>
          <Link to="/" className="hover:text-brand-primary flex items-center">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return <li key={name} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              {isLast ? <span className="text-brand-primary font-semibold capitalize">
                  {name}
                </span> : <Link to={routeTo} className="hover:text-brand-primary capitalize">
                  {name}
                </Link>}
            </li>;
      })}
      </ol>
    </nav>;
};