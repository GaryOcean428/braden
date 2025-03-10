
import { ContactForm } from "./ContactForm";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const Contact = () => {
  return (
    <section id="contact" className="bg-[#2c3e50] text-white py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl mb-12 text-center">
            Get in Touch
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="font-montserrat font-semibold text-xl mb-6 text-[#cbb26a]">
                Contact Information
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <MapPinIcon className="h-6 w-6 mr-3 text-[#ab233a] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-opensans">5/339 Cambridge Street,</p>
                    <p className="font-opensans">WEMBLEY, WA 6014</p>
                  </div>
                </li>
                
                <li className="flex items-center">
                  <PhoneIcon className="h-6 w-6 mr-3 text-[#ab233a] flex-shrink-0" />
                  <a href="tel:+61861667500" className="font-opensans hover:text-[#cbb26a] transition-colors">
                    +61 8 6166 7500
                  </a>
                </li>
                
                <li className="flex items-center">
                  <EnvelopeIcon className="h-6 w-6 mr-3 text-[#ab233a] flex-shrink-0" />
                  <a href="mailto:info@braden.com.au" className="font-opensans hover:text-[#cbb26a] transition-colors">
                    info@braden.com.au
                  </a>
                </li>
              </ul>
              
              <div className="mt-8">
                <h3 className="font-montserrat font-semibold text-xl mb-4 text-[#cbb26a]">
                  Business Hours
                </h3>
                <p className="font-opensans">Monday - Friday: 8:30 AM - 5:00 PM</p>
                <p className="font-opensans">Saturday & Sunday: Closed</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-md">
              <ContactForm />
            </div>
          </div>
          
          <div className="text-center">
            <p className="font-montserrat text-lg font-semibold text-[#cbb26a]">
              People. Employment. Progress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
