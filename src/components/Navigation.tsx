import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-background/80 backdrop-blur-sm z-50 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="text-xl font-semibold">
          braden
        </a>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-8">
          <a href="#work" className="hover-underline">
            Work
          </a>
          <a href="#contact" className="hover-underline">
            Contact
          </a>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm md:hidden p-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <a
                href="#work"
                className="hover-underline"
                onClick={() => setIsOpen(false)}
              >
                Work
              </a>
              <a
                href="#contact"
                className="hover-underline"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;