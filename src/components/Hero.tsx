const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fadeIn">
          Hi, I'm Braden
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          I create digital experiences that make an impact
        </p>
      </div>
    </section>
  );
};

export default Hero;