
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DesktopMenuProps {
  isAdmin?: boolean;
  scrollToSection: (sectionId: string) => void;
}

const DesktopMenu = ({ isAdmin, scrollToSection }: DesktopMenuProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed", {
          description: error.message
        });
      } else {
        toast.success("Logged out successfully");
        // Navigate to auth page with logout parameter
        navigate('/admin/auth?logout=true', { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-6 text-white font-montserrat">
      <button
        onClick={() => scrollToSection("services")}
        className="hover:opacity-80 transition-opacity"
      >
        Services
      </button>
      
      <button
        onClick={() => scrollToSection("about")}
        className="hover:opacity-80 transition-opacity"
      >
        About
      </button>
      
      <button
        onClick={() => scrollToSection("contact")}
        className="hover:opacity-80 transition-opacity"
      >
        Contact
      </button>
      
      {isAdmin && (
        <>
          <Link
            to="/admin"
            className="hover:opacity-80 transition-opacity"
          >
            Admin
          </Link>
          <button
            onClick={handleLogout}
            className="bg-[#ab233a] text-white px-3 py-1 rounded hover:bg-[#811a2c] transition-colors"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default DesktopMenu;
