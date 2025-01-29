import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === "braden.lang77@gmail.com") {
        setIsAdmin(true);
      }
    };

    checkAdminStatus();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-brand-primary shadow-lg" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a 
            href="/" 
            className="text-white font-montserrat text-xl font-bold"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            braden
          </a>
          
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

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
        </div>

        {isOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsOpen(false);
                }}
                className="text-white font-opensans hover:text-opacity-80"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
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
                onClick={() => scrollToSection('contact')}
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
        )}
      </div>
    </nav>
  );
};

export default Navigation;