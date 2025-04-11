
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const serviceData = {
  'compliance': {
    title: 'Regulatory Compliance Management',
    description: 'Ensuring all placements adhere to industry regulations and standards, managing compliance with training requirements and workplace safety.',
    icon: 'shield',
    content: [
      'Our compliance management service ensures that your business meets all regulatory requirements in the apprenticeship and traineeship space.',
      'We handle paperwork and documentation required by government bodies and training organizations.',
      'Regular audits and checks to ensure ongoing compliance with changing regulations.',
      'Risk management strategies to identify and mitigate compliance issues before they arise.',
      'Expert guidance on workplace safety requirements specific to apprentices and trainees.'
    ]
  },
  'mentoring': {
    title: 'Mentoring & Career Coaching',
    description: 'Our ongoing support helps apprentices and trainees develop their skills and navigate their career paths effectively through regular mentoring sessions.',
    icon: 'users',
    content: [
      'One-on-one mentoring sessions with industry professionals.',
      'Career development planning tailored to individual goals and aspirations.',
      'Regular progress reviews to identify areas for improvement.',
      'Soft skills training to complement technical abilities.',
      'Support for both workplace challenges and personal development.'
    ]
  },
  'technology': {
    title: 'Technology Solutions',
    description: 'Including software licensing and managed IT services to keep your business operations running smoothly.',
    icon: 'computer',
    content: [
      'Tailored IT solutions for businesses in the training and employment sectors.',
      'Software licensing management to ensure compliance and cost-effectiveness.',
      'Managed IT services to reduce downtime and improve productivity.',
      'Cloud-based solutions for training management and record keeping.',
      'Integration of existing systems with our apprenticeship management platform.'
    ]
  },
  'future-services': {
    title: 'Future Services',
    description: 'Customized training programs, digital skills-matching platform, online learning opportunities, and expanded IT services coming soon.',
    icon: 'rocket',
    content: [
      'Digital skills-matching platform to connect employers with the right apprentices.',
      'Custom training programs tailored to specific industry needs.',
      'Online learning portal with on-demand courses and resources.',
      'Advanced analytics for workforce planning and development.',
      'Expanded IT services including cybersecurity for the education sector.'
    ]
  }
};

const Service = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  
  const service = serviceId ? serviceData[serviceId as keyof typeof serviceData] : null;
  
  useEffect(() => {
    // Redirect to services section on home page if service not found
    if (!service && serviceId) {
      navigate('/#services', { replace: true });
    }
    
    window.scrollTo(0, 0);
  }, [service, serviceId, navigate]);
  
  if (!service) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-braden-navy">Service Not Found</h1>
            <p className="mt-4 mb-8">The requested service information is not available.</p>
            <button 
              onClick={() => navigate('/#services')}
              className="px-4 py-2 bg-braden-red text-white rounded hover:bg-braden-dark-red"
            >
              View All Services
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold text-braden-navy">{service.title}</h1>
          </div>
          
          <p className="text-lg text-gray-700 mb-8 font-opensans">{service.description}</p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-braden-red">Our Approach</h2>
            <ul className="space-y-4 font-opensans">
              {service.content.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-braden-gold mr-3">•</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Interested in our {service.title} service?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/contact')}
                className="px-6 py-3 bg-braden-red text-white rounded-lg hover:bg-braden-dark-red"
              >
                Contact Us
              </button>
              <button 
                onClick={() => navigate('/#services')}
                className="px-6 py-3 border border-braden-red text-braden-red rounded-lg hover:bg-gray-50"
              >
                View All Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Service;
