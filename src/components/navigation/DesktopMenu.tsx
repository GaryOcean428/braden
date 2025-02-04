import { useNavigate } from "react-router-dom";
import ServicesDropdown from "./ServicesDropdown";
import { navigationItems } from "@/config/navigation";

interface DesktopMenuProps {
  isAdmin: boolean;
  scrollToSection: (sectionId: string) => void;
}

const DesktopMenu = ({ isAdmin, scrollToSection }: DesktopMenuProps) => {
  const navigate = useNavigate();

  const handleItemClick = (action: 'scroll' | 'navigate', target: string) => {
    if (action === 'scroll') {
      scrollToSection(target);
    } else {
      navigate(target);
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-8">
      {navigationItems.map((item) => (
        <button
          key={item.label}
          onClick={() => handleItemClick(item.action, item.target)}
          className="text-white font-opensans hover:text-opacity-80 hover-underline"
        >
          {item.label}
        </button>
      ))}
      <ServicesDropdown scrollToSection={scrollToSection} />
      {isAdmin && (
        <>
          <a 
            href="/admin" 
            className="text-white font-opensans hover:text-opacity-80 hover-underline"
          >
            Admin
          </a>
          <a 
            href="/admin/editor" 
            className="text-white font-opensans hover:text-opacity-80 hover-underline"
          >
            Editor
          </a>
        </>
      )}
    </div>
  );
};

export default DesktopMenu;