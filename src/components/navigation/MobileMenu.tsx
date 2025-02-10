
import { useNavigate } from "react-router-dom";
import { navigationItems } from "@/config/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAdmin: boolean;
  scrollToSection: (sectionId: string) => void;
}

const MobileMenu = ({ isOpen, setIsOpen, isAdmin, scrollToSection }: MobileMenuProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleItemClick = (action: 'scroll' | 'navigate', target: string) => {
    if (action === 'scroll') {
      scrollToSection(target);
    } else {
      navigate(target);
    }
    setIsOpen(false);
  };

  return (
    <div className="md:hidden py-4 animate-fadeIn">
      <div className="flex flex-col space-y-4">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleItemClick(item.action, item.target)}
            className="text-white font-opensans hover:text-opacity-80"
          >
            {item.label}
          </button>
        ))}
        {isAdmin && (
          <>
            <a href="/admin" className="text-white font-opensans hover:text-opacity-80">
              Admin
            </a>
            <a href="/admin/editor" className="text-white font-opensans hover:text-opacity-80">
              Editor
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
