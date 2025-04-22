import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="breadcrumbs" className="bg-background py-2 px-4 border-b">
      <ol className="list-none p-0 inline-flex items-center">
        <li className="flex items-center">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
          {pathnames.length > 0 && (
            <svg
              className="h-6 w-6 align-middle text-braden-gold mx-2 my-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li className="flex items-center" key={name}>
              {!isLast ? (
                <>
                  <Link to={routeTo} className="text-foreground hover:text-primary transition-colors capitalize">
                    {name.replace(/[-]/g, ' ')}
                  </Link>
                  <svg
                    className="h-6 w-6 align-middle text-braden-gold mx-2 my-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              ) : (
                <span className="text-gray-500 capitalize">
                  {name.replace(/[-]/g, ' ')}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
