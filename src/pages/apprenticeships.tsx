import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, BookOpen, GraduationCap } from "lucide-react";
import Layout from "@/components/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { toast } from "sonner";
import { ContactForm } from "@/components/ContactForm";

const ApprenticeshipsPage = () => {
  const handleApplyNow = () => {
    toast.info("Redirecting to application form...");
    window.location.href = 'mailto:apprenticeships@braden.com.au';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <ErrorBoundary>
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Apprenticeship Programs
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Launch your career with our comprehensive apprenticeship opportunities
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Programs
            </Button>
          </div>
        </section>
      </ErrorBoundary>

      {/* Programs Section */}
      <ErrorBoundary>
        <section id="programs" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Available Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 text-brand-primary mr-3" />
                  <h3 className="text-xl font-semibold">Trade Apprenticeships</h3>
                </div>
                <p className="text-gray-600">
                  Hands-on training in various trades with experienced mentors and industry partners.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-8 w-8 text-brand-primary mr-3" />
                  <h3 className="text-xl font-semibold">Technical Programs</h3>
                </div>
                <p className="text-gray-600">
                  Specialized technical training combining classroom learning with practical experience.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-8 w-8 text-brand-primary mr-3" />
                  <h3 className="text-xl font-semibold">Professional Development</h3>
                </div>
                <p className="text-gray-600">
                  Ongoing support and development opportunities throughout your apprenticeship journey.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Benefits Section */}
      <ErrorBoundary>
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits of Our Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">For Apprentices</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                    Earn while you learn
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                    Nationally recognized qualifications
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                    Hands-on industry experience
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                    Career progression opportunities
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">For Employers</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                    Access to motivated talent
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                    Government incentives
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                    Customized training programs
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                    Ongoing support and guidance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Contact Form Section */}
      <ErrorBoundary>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
            <p className="text-center text-gray-600 mb-8">
              Interested in our apprenticeship programs? Fill out the form below and we'll get back to you shortly.
            </p>
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* CTA Section */}
      <ErrorBoundary>
        <section className="py-16 bg-brand-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Start Your Journey Today</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Take the first step towards your future career with our apprenticeship programs.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleApplyNow}
            >
              Apply Now
            </Button>
          </div>
        </section>
      </ErrorBoundary>
    </Layout>
  );
};

export default ApprenticeshipsPage;