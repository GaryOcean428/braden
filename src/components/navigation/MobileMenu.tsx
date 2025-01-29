import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAdmin: boolean;
  scrollToSection: (sectionId: string) => void;
}

const MobileMenu = ({ isOpen, setIsOpen, isAdmin, scrollToSection }: MobileMenuProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 animate-fadeIn">
      <div className="flex flex-col space-y-4">
        <button 
          onClick={() => {
            navigate('/');
            setIsOpen(false);
          }}
          className="text-white font-opensans hover:text-opacity-80"
        >
          Home
        </button>
        <button 
          onClick={() => {
            scrollToSection('about');
            setIsOpen(false);
          }}
          className="text-white font-opensans hover:text-opacity-80"
        >
          About
        </button>
        <button 
          onClick={() => {
            scrollToSection('services');
            setIsOpen(false);
          }}
          className="text-white font-opensans hover:text-opacity-80"
        >
          Services
        </button>
        <button 
          onClick={() => {
            navigate('/apprenticeships');
            setIsOpen(false);
          }}
          className="text-white font-opensans hover:text-opacity-80"
        >
          Apprenticeships
        </button>
        <button 
          onClick={() => {
            navigate('/traineeships');
            setIsOpen(false);
          }}
          className="text-white font-opensans hover:text-opacity-80"
        >
          Traineeships
        </button>
        <button 
          onClick={() => {
            navigate('/recruitment');
            setIsOpen(false);
          }}
          className="text-white font-opensans hover:text-opacity-80"
        >
          Recruitment
        </button>
        <button 
          onClick={() => {
            scrollToSection('contact');
            setIsOpen(false);
          }}
          className="text-white font-opensans hover:text-opacity-80"
        >
          Contact
        </button>
        {isAdmin && (
          <a href="/admin" className="text-white font-opensans hover:text-opacity-80">
            Admin
          </a>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;