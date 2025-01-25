const About = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-12 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-montserrat font-bold text-2xl md:text-3xl lg:text-4xl mb-8 text-center">
          Why Choose Us?
        </h2>
        <p className="font-opensans text-base md:text-lg mb-8 text-gray-700 leading-relaxed">
          Braden Group stands out with our holistic approach to workforce development. We not only place and manage apprentices and trainees but also provide essential support services such as mentoring, career coaching, and compliance management.
        </p>
        
        <h3 className="font-montserrat font-bold text-xl md:text-2xl mb-6 text-center">Our Mission</h3>
        <p className="font-opensans text-base md:text-lg mb-8 text-gray-700 leading-relaxed">
          Our mission is to empower individuals and businesses through innovative workforce solutions that foster growth, compliance, and excellence. We are committed to bridging the gap between education and employment by offering comprehensive support services and tailored solutions.
        </p>
        
        <div className="text-center">
          <h3 className="font-montserrat font-bold text-xl md:text-2xl mb-6">Target Market</h3>
          <p className="font-opensans text-base md:text-lg mb-8 text-gray-700 leading-relaxed">
            We serve individuals aged 16-35 seeking career opportunities through apprenticeships and traineeships, as well as businesses looking for skilled workers. Our services span across urban and suburban areas, with plans to expand into rural regions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;