
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

  const handleItemClick = (action: 'scroll' | 'navigate', target: string) => {
    if (action === 'scroll') {
      scrollToSection(target);
    } else {
      navigate(target);
    }
    setIsOpen(false);
  };

  return (
    <div 
      className={`md:hidden fixed inset-x-0 top-[60px] bg-brand-primary/95 backdrop-blur-sm transition-all duration-300 ease-in-out font-montserrat ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="px-4 py-4">
        <div className="flex flex-col space-y-4">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item.action, item.target)}
              className="text-white hover:text-opacity-80 transition-opacity text-left py-2"
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button 
              onClick={() => {
                navigate('/admin');
                setIsOpen(false);
              }}
              className="text-white hover:text-opacity-80 transition-opacity text-left py-2"
            >
              Admin Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
