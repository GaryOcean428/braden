import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HeroImage } from "./hero/HeroImage";
import { ErrorBoundary } from "./ErrorBoundary";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartHiring = () => {
    toast.info("Redirecting to hiring portal...");
    navigate('/recruitment');
  };

  const handleFindOpportunities = () => {
    toast.info("Exploring opportunities...");
    navigate('/apprenticeships');
  };

  const handleImageError = (error: Error) => {
    toast.error("Failed to load hero image");
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex items-center justify-center"
      role="banner"
      aria-label="Welcome to Braden Group"
    >
      <div className="absolute inset-0">
        <ErrorBoundary>
          <HeroImage onError={handleImageError} />
        </ErrorBoundary>
        <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true"></div>
      </div>
      <div 
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 py-12 md:py-20"
        role="contentinfo"
      >
        <h1 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 animate-fadeIn leading-tight">
          Shaping Tomorrow's <br />Workforce Today
        </h1>
        <p className="font-opensans text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
          Professional recruiting solutions for apprenticeships and traineeships
        </p>
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          role="group"
          aria-label="Call to action buttons"
        >
          <button 
            onClick={handleStartHiring}
            className="bg-brand-primary text-white font-montserrat font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-opacity-90 transition-all text-sm sm:text-base focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary focus:outline-none"
            aria-label="Start hiring apprentices and trainees"
          >
            Start Hiring
          </button>
          <button 
            onClick={handleFindOpportunities}
            className="bg-white text-brand-primary font-montserrat font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-opacity-90 transition-all text-sm sm:text-base focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
            aria-label="Find apprenticeship and traineeship opportunities"
          >
            Find Opportunities
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;