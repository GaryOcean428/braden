import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [heroImage, setHeroImage] = useState("/hero-image.jpg");

  useEffect(() => {
    const loadHeroImage = async () => {
      const { data, error } = await supabase
        .from('media')
        .select('file_path')
        .eq('title', 'hero-image')
        .single();

      if (data && !error) {
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(data.file_path);
        setHeroImage(publicUrl);
      }
    };

    loadHeroImage();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Braden Group Apprentices"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 py-12 md:py-20">
        <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 animate-fadeIn leading-tight">
          Shaping Tomorrow's <br />Workforce Today
        </h1>
        <p className="font-opensans text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
          Professional recruiting solutions for apprenticeships and traineeships
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-brand-primary text-white font-montserrat font-bold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all text-base">
            Start Hiring
          </button>
          <button className="bg-white text-brand-primary font-montserrat font-bold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all text-base">
            Find Opportunities
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;