import { useState, useEffect } from "react";
import { Menu, X, Share2, Share } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import MobileMenu from "./navigation/MobileMenu";
import DesktopMenu from "./navigation/DesktopMenu";
import ShareModal from "./ShareModal";
import { ErrorBoundary } from "./ErrorBoundary";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      } finally {
        setIsLoading(false);
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
          isScrolled ? "bg-brand-primary shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a 
              href="/" 
              className="text-white font-montserrat text-xl font-bold relative z-10"
              onClick={handleHomeClick}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                "braden"
              )}
            </a>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <ShareModal icon={<Share className="h-4 w-4" />} />
                <ShareModal icon={<Share2 className="h-4 w-4" />} />
              </div>
              <button
                className="md:hidden text-white relative z-20"
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
