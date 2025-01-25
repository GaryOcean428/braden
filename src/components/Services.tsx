const Services = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-montserrat font-bold text-2xl md:text-3xl lg:text-4xl mb-12 text-center">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {[
            {
              title: "Apprenticeship & Traineeship Placement",
              description: "We specialize in placing apprentices and trainees into suitable roles while managing their progress to ensure adherence to industry regulations."
            },
            {
              title: "Mentoring & Career Coaching",
              description: "Our ongoing support helps apprentices and trainees develop their skills and navigate their career paths effectively."
            },
            {
              title: "Recruitment & Labor Hire Solutions",
              description: "We offer both temporary staffing solutions and assistance in finding long-term skilled workers."
            },
            {
              title: "Financing Solutions",
              description: "Covering wage expenses and equipment costs to alleviate financial pressures on businesses."
            },
            {
              title: "Technology Solutions",
              description: "Including software licensing and managed IT services to keep your business operations running smoothly."
            }
          ].map((service, index) => (
            <div 
              key={index} 
              className="p-6 md:p-8 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <h3 className="font-roboto font-bold text-lg md:text-xl mb-4">{service.title}</h3>
              <p className="font-opensans text-gray-600 text-sm md:text-base">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;