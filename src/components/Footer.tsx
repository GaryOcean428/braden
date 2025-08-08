import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2c3e50] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Braden Group</h3>
            <p className="text-gray-300">Shaping Tomorrow's Workforce Today</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300">
              Email: info@bradengroup.com.au
              <br />
              Phone: (02) 1234 5678
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Button
                  variant="link"
                  className="p-0 text-gray-300 hover:text-white"
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 text-gray-300 hover:text-white"
                  onClick={() => navigate('/services')}
                >
                  Services
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 text-gray-300 hover:text-white"
                  onClick={() => navigate('/about')}
                >
                  About Us
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 text-gray-300 hover:text-white"
                  onClick={() => navigate('/contact')}
                >
                  Contact
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Braden Group. All rights reserved.
          </p>

          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Button
              variant="link"
              className="text-xs text-gray-400 hover:text-white"
              onClick={() => navigate('/privacy')}
            >
              Privacy Policy
            </Button>
            <Button
              variant="link"
              className="text-xs text-gray-400 hover:text-white"
              onClick={() => navigate('/terms')}
            >
              Terms of Service
            </Button>
            <Button
              variant="link"
              className="text-xs text-gray-400 hover:text-white opacity-50 hover:opacity-100"
              onClick={() => navigate('/admin/auth')}
              aria-label="Admin Access"
            >
              Admin
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
