const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 md:px-8 lg:px-12">
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/855bff02-d08c-4a39-b7c2-81b44f2ad60b.png"
          alt="City skyline"
          className="w-full h-full object-cover brightness-50"
        />
      </div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
        <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl mb-6 animate-fadeIn leading-tight">
          Welcome to Braden Group
        </h1>
        <p className="font-opensans text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          We are dedicated to transforming the workforce landscape through innovative apprenticeships and traineeships.
        </p>
        <button className="bg-white text-black font-montserrat font-bold px-6 py-3 md:px-8 md:py-4 rounded-lg hover:bg-opacity-90 transition-all text-sm md:text-base">
          Contact Us
        </button>
      </div>
    </section>
  );
};

export default Hero;