import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Award } from "lucide-react";
import Layout from "@/components/Layout";

const TraineeshipsPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Traineeship Opportunities
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Develop your skills and kickstart your career with our structured training programs
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Opportunities
          </Button>
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="opportunities" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Available Traineeships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-brand-primary mr-3" />
                <h3 className="text-xl font-semibold">Business Administration</h3>
              </div>
              <p className="text-gray-600">
                Comprehensive training in office administration, customer service, and business operations.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-brand-primary mr-3" />
                <h3 className="text-xl font-semibold">Information Technology</h3>
              </div>
              <p className="text-gray-600">
                Hands-on experience in IT support, network administration, and software development.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 text-brand-primary mr-3" />
                <h3 className="text-xl font-semibold">Digital Marketing</h3>
              </div>
              <p className="text-gray-600">
                Learn digital marketing strategies, social media management, and content creation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Program Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Learning</h3>
              <p className="text-gray-600">Combination of on-the-job training and formal education</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Industry Experience</h3>
              <p className="text-gray-600">Real-world application of skills in workplace settings</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mentorship</h3>
              <p className="text-gray-600">Guidance from experienced industry professionals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Certification</h3>
              <p className="text-gray-600">Nationally recognized qualifications upon completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-brand-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Begin Your Career Journey</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Take the first step towards a rewarding career with our traineeship programs.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => window.location.href = 'mailto:traineeships@braden.com.au'}
          >
            Apply Now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default TraineeshipsPage;
