import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-brand-primary z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-white font-montserrat text-xl font-bold">
          braden
        </a>
        
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-white font-opensans hover:text-opacity-80">
            Home
          </a>
          <a href="/about" className="text-white font-opensans hover:text-opacity-80">
            About
          </a>
          <a href="/offering" className="text-white font-opensans hover:text-opacity-80">
            Our Offering
          </a>
          <a href="/contact" className="text-white font-opensans hover:text-opacity-80">
            Contact
          </a>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-brand-primary md:hidden py-4 animate-fadeIn shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <a href="/" className="text-white font-opensans hover:text-opacity-80">
                Home
              </a>
              <a href="/about" className="text-white font-opensans hover:text-opacity-80">
                About
              </a>
              <a href="/offering" className="text-white font-opensans hover:text-opacity-80">
                Our Offering
              </a>
              <a href="/contact" className="text-white font-opensans hover:text-opacity-80">
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