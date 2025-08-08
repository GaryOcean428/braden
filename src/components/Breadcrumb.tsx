import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If there are no additional paths beyond the root, don't render anything
  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="breadcrumbs" className="container mx-auto px-4 py-2">
      <ol className="list-none p-0 inline-flex items-center text-sm text-gray-500">
        <li className="flex items-center">
          <Link
            to="/"
            className="text-braden-navy hover:text-braden-red transition-colors flex items-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
          {pathnames.length > 0 && (
            <span className="mx-2 text-gray-400">/</span>
          )}
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={name} className="flex items-center">
              {isLast ? (
                <span className="capitalize text-gray-700">
                  {name.replace(/[-]/g, ' ')}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-braden-navy hover:text-braden-red transition-colors capitalize"
                >
                  {name.replace(/[-]/g, ' ')}
                </Link>
              )}
              {!isLast && <span className="mx-2 text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
