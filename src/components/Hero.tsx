const Hero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/855bff02-d08c-4a39-b7c2-81b44f2ad60b.png"
          alt="City skyline"
          className="w-full h-full object-cover brightness-50"
        />
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="font-montserrat font-bold text-3xl md:text-5xl lg:text-6xl mb-6 animate-fadeIn">
          Welcome to Braden Group
        </h1>
        <p className="font-opensans text-lg md:text-xl mb-8">
          We are dedicated to transforming the workforce landscape through innovative apprenticeships and traineeships.
        </p>
        <button className="bg-white text-black font-montserrat font-bold px-8 py-3 rounded hover:bg-opacity-90 transition-all">
          Contact Us
        </button>
      </div>
    </section>
  );
};

export default Hero;