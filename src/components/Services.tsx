const Services = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-montserrat font-bold text-2xl md:text-4xl mb-12 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div key={index} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-roboto font-bold text-xl mb-4">{service.title}</h3>
              <p className="font-opensans text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;