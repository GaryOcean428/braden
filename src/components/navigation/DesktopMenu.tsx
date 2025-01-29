import ServicesDropdown from "./ServicesDropdown";

interface DesktopMenuProps {
  isAdmin: boolean;
  scrollToSection: (sectionId: string) => void;
}

const DesktopMenu = ({ isAdmin, scrollToSection }: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-white font-opensans hover:text-opacity-80 hover-underline"
      >
        Home
      </button>
      <button 
        onClick={() => scrollToSection('about')}
        className="text-white font-opensans hover:text-opacity-80 hover-underline"
      >
        About
      </button>
      <ServicesDropdown scrollToSection={scrollToSection} />
      <button 
        onClick={() => scrollToSection('contact')}
        className="text-white font-opensans hover:text-opacity-80 hover-underline"
      >
        Contact
      </button>
      {isAdmin && (
        <a href="/admin" className="text-white font-opensans hover:text-opacity-80 hover-underline">
          Admin
        </a>
      )}
    </div>
  );
};

export default DesktopMenu;