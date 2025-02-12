import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import MobileMenu from "./navigation/MobileMenu";
import DesktopMenu from "./navigation/DesktopMenu";
import { ErrorBoundary } from "./ErrorBoundary";
import GoldLogo from "/500x160 Gold Logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === "braden.lang77@gmail.com") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    } else {
      navigate('/', { replace: true });
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/', { replace: true });
    }
    setIsOpen(false);
  };

  return (
    <ErrorBoundary>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-brand-primary/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
        }`}
        style={{ position: 'fixed', top: 0 }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <a 
              href="/" 
              className="text-white font-montserrat text-xl font-bold relative z-10 hover:opacity-80 transition-opacity"
              onClick={handleHomeClick}
            >
              <img 
                src={GoldLogo} 
                alt="Gold Logo" 
                className="h-8" 
                srcSet="/500x160 Gold Logo.png 1x, /500x160 Gold Logo@2x.png 2x"
                loading="lazy"
              />
            </a>
            
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-white relative z-20 hover:opacity-80 transition-opacity"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="relative z-10">
                <DesktopMenu isAdmin={isAdmin} scrollToSection={scrollToSection} />
              </div>
            </div>
          </div>

          <MobileMenu 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isAdmin={isAdmin}
            scrollToSection={scrollToSection}
          />
        </div>
      </nav>
    </ErrorBoundary>
  );
};

export default Navigation;
