import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  return <nav aria-label="Breadcrumb" className="bg-[#811a2c] px-0 py-0 rounded-none my-0 mx-0">
      <ol className="flex items-center space-x-2 text-sm text-gray-200">
        <li>
          <Link to="/" className="hover:text-white flex items-center">
            <Home className="h-4 w-4 py-0 mx-[7px] my-[9px]" />
          </Link>
        </li>
        {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return <li key={name} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              {isLast ? <span className="text-[#cbb26a] font-semibold capitalize">
                  {name}
                </span> : <Link to={routeTo} className="hover:text-[#cbb26a] capitalize">
                  {name}
                </Link>}
            </li>;
      })}
      </ol>
    </nav>;
};