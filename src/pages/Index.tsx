import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "../components/Layout";
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

    // Ensure we start at the top of the page when navigating to home
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout showBreadcrumb={false}>
      <main className="min-h-screen">
        <Hero />
        <div id="services" className="scroll-mt-20">
          <Services />
        </div>
        <div id="about" className="scroll-mt-20">
          <About />
        </div>
        <div id="contact" className="scroll-mt-20">
          <Contact />
        </div>
        {isAdmin && <MediaManager />}
      </main>
    </Layout>
  );
};

export default Index;