import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServicesDropdownProps {
  scrollToSection: (sectionId: string) => void;
}

const ServicesDropdown = ({ scrollToSection }: ServicesDropdownProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative group">
      <button className="text-white font-opensans hover:text-opacity-80 flex items-center hover-underline">
        Services <ChevronDown size={16} className="ml-1" />
      </button>
      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        <button
          onClick={() => scrollToSection('services')}
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
        >
          All Services
        </button>
        <button
          onClick={() => navigate('/apprenticeships')}
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
        >
          Apprenticeships
        </button>
        <button
          onClick={() => navigate('/traineeships')}
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
        >
          Traineeships
        </button>
        <button
          onClick={() => navigate('/recruitment')}
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
        >
          Recruitment
        </button>
      </div>
    </div>
  );
};

export default ServicesDropdown;
