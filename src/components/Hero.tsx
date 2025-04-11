
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
    console.error("Hero image error:", error);
    // No need to show a toast as we already handle fallbacks in HeroImage
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" 
      role="banner" 
      aria-label="Welcome to Braden Group"
    >
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <HeroImage onError={handleImageError} />
        </ErrorBoundary>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#2c3e50]/80 to-[#811a2c]/80"></div>
      </div>
      
      <div 
        role="contentinfo" 
        className="relative z-20 text-center text-white max-w-4xl mx-auto px-4 py-12 md:py-[25px]"
      >
        <h1 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 animate-fadeIn leading-tight">
          Shaping Tomorrow's <br />Workforce Today
        </h1>
        
        <p className="font-opensans text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
          Professional recruiting solutions for apprenticeships and traineeships
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8" role="group" aria-label="Call to action buttons">
          <button 
            onClick={handleStartHiring} 
            className="bg-[#ab233a] hover:bg-[#811a2c] text-white font-montserrat font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all text-sm sm:text-base focus:ring-2 focus:ring-offset-2 focus:ring-[#ab233a] focus:outline-none" 
            aria-label="Start hiring apprentices and trainees"
          >
            Start Hiring
          </button>
          
          <button 
            onClick={handleFindOpportunities} 
            className="bg-white text-[#ab233a] hover:bg-gray-100 font-montserrat font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all text-sm sm:text-base focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none" 
            aria-label="Find apprenticeship and traineeship opportunities"
          >
            Find Opportunities
          </button>
        </div>
        
        <div className="mt-8 inline-block">
          <p className="text-[#cbb26a] font-semibold font-montserrat">People. Employment. Progress.</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
