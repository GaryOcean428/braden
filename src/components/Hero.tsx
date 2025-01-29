import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

/**
 * Hero component displays the main landing section of the website
 * Includes a background image, heading, and call-to-action buttons
 * @returns {JSX.Element} Hero section with responsive design and accessibility features
 */
const Hero = () => {
  const [heroImage, setHeroImage] = useState("/hero-image.jpg");
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        const { data, error } = await supabase
          .from('media')
          .select('file_path')
          .eq('title', 'hero-image')
          .single();

        if (error) throw error;

        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(data.file_path);
          setHeroImage(publicUrl);
        }
      } catch (error) {
        console.error('Error loading hero image:', error);
        setImageError(true);
        toast.error("Failed to load hero image");
      } finally {
        setIsLoading(false);
      }
    };

    loadHeroImage();
  }, []);

  const handleStartHiring = () => {
    toast.info("Redirecting to hiring portal...");
    navigate('/recruitment');
  };

  const handleFindOpportunities = () => {
    toast.info("Exploring opportunities...");
    navigate('/apprenticeships');
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex items-center justify-center"
      role="banner"
      aria-label="Welcome to Braden Group"
    >
      <div className="absolute inset-0">
        {isLoading ? (
          <Skeleton className="w-full h-full" aria-hidden="true" />
        ) : imageError ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Loader className="h-12 w-12 text-gray-400 animate-spin" aria-hidden="true" />
          </div>
        ) : (
          <img
            src={heroImage}
            alt="Braden Group Apprentices"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true"></div>
      </div>
      <div 
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 py-12 md:py-20"
        role="contentinfo"
      >
        <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 animate-fadeIn leading-tight">
          Shaping Tomorrow's <br />Workforce Today
        </h1>
        <p className="font-opensans text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
          Professional recruiting solutions for apprenticeships and traineeships
        </p>
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          role="group"
          aria-label="Call to action buttons"
        >
          <button 
            onClick={handleStartHiring}
            className="bg-brand-primary text-white font-montserrat font-bold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all text-base focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary focus:outline-none"
            aria-label="Start hiring apprentices and trainees"
          >
            Start Hiring
          </button>
          <button 
            onClick={handleFindOpportunities}
            className="bg-white text-brand-primary font-montserrat font-bold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all text-base focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
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