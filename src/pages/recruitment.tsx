
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Users, Award, Search } from "lucide-react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

const RecruitmentPage = () => {
  const navigate = useNavigate();

  const navigateToContact = () => {
    // Navigate to homepage and scroll to contact section
    navigate('/#contact');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Expert Recruitment Solutions
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Connecting talented professionals with leading businesses across Australia
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Our Services
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Recruitment Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Briefcase className="h-8 w-8 text-brand-primary mr-3" />
                <h3 className="text-xl font-semibold">Permanent Placement</h3>
              </div>
              <p className="text-gray-600">
                Find the perfect long-term fit for your organization with our comprehensive permanent recruitment solutions.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-brand-primary mr-3" />
                <h3 className="text-xl font-semibold">Contract Staffing</h3>
              </div>
              <p className="text-gray-600">
                Flexible staffing solutions for project-based needs and temporary workforce requirements.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Search className="h-8 w-8 text-brand-primary mr-3" />
                <h3 className="text-xl font-semibold">Executive Search</h3>
              </div>
              <p className="text-gray-600">
                Specialized recruitment for senior-level and executive positions across industries.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Recruitment Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Understanding Needs</h3>
              <p className="text-gray-600">We take time to understand your specific requirements and company culture</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Candidate Search</h3>
              <p className="text-gray-600">Thorough screening and shortlisting of qualified candidates</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interview Process</h3>
              <p className="text-gray-600">Coordinating interviews and facilitating communication</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Placement & Follow-up</h3>
              <p className="text-gray-600">Ensuring successful onboarding and continued support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-brand-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you're looking to hire or seeking new opportunities, we're here to help.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={navigateToContact}
          >
            Contact Us Today
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default RecruitmentPage;
