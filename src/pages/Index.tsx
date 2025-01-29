import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import Contact from "../components/Contact";
import MediaManager from "../components/MediaManager";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === "braden.lang77@gmail.com") {
        setIsAdmin(true);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <div id="services">
          <Services />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="contact">
          <Contact />
        </div>
        {isAdmin && <MediaManager />}
      </main>
    </div>
  );
};

export default Index;