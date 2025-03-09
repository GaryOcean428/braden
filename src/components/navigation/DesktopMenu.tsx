
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
          className="text-white font-opensans relative overflow-hidden group"
        >
          <span className="relative z-10 hover:opacity-80 transition-opacity">
            {item.label}
          </span>
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-left scale-x-0 transition-transform group-hover:scale-x-100" />
        </button>
      ))}
      <ServicesDropdown scrollToSection={scrollToSection} />
      {isAdmin && (
        <button
          onClick={() => navigate('/admin')}
          className="text-white font-opensans relative overflow-hidden group"
        >
          <span className="relative z-10 hover:opacity-80 transition-opacity">
            Admin Dashboard
          </span>
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-left scale-x-0 transition-transform group-hover:scale-x-100" />
        </button>
      )}
    </div>
  );
};

export default DesktopMenu;
