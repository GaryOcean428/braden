
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import Contact from "../components/Contact";
import MediaManager from "../components/MediaManager";
import { ErrorBoundary } from "../components/ErrorBoundary";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === "braden.lang77@gmail.com") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <div id="services" className="scroll-mt-20">
          <Services />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <div id="about" className="scroll-mt-20">
          <About />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <div id="contact" className="scroll-mt-20">
          <Contact />
        </div>
      </ErrorBoundary>
      
      {isAdmin && (
        <ErrorBoundary>
          <MediaManager />
        </ErrorBoundary>
      )}
    </>
  );
};

export default Index;
