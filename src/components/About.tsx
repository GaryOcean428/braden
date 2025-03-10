
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl mb-10 text-center text-[#2c3e50]">
          Why Choose Us?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="font-opensans text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              Braden Group stands out with our holistic approach to workforce development. We not only place and manage apprentices and trainees but also provide essential support services such as mentoring, career coaching, and compliance management.
            </p>
            
            <p className="font-opensans text-base md:text-lg text-gray-700 leading-relaxed">
              Our experienced team understands the unique challenges faced by both businesses and individuals in the apprenticeship and traineeship space, allowing us to create tailored solutions that drive success.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-[#ab233a]">
            <h3 className="font-montserrat font-bold text-xl md:text-2xl mb-6 text-[#2c3e50]">Our Mission</h3>
            <p className="font-opensans text-base md:text-lg text-gray-700 leading-relaxed">
              Our mission is to empower individuals and businesses through innovative workforce solutions that foster growth, compliance, and excellence. We are committed to bridging the gap between education and employment by offering comprehensive support services and tailored solutions.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="font-montserrat font-bold text-xl md:text-2xl mb-6 text-center text-[#2c3e50]">Target Market</h3>
          <p className="font-opensans text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-8">
            We serve individuals aged 16-35 seeking career opportunities through apprenticeships and traineeships, as well as businesses looking for skilled workers. Our services span across urban and suburban areas, with plans to expand into rural regions.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/contact')}
              className="bg-[#ab233a] hover:bg-[#811a2c] text-white"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
