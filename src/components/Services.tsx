import { useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  UsersIcon,
  ComputerDesktopIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { ErrorBoundary } from './ErrorBoundary';

const Services = () => {
  const navigate = useNavigate();

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  const services = [
    {
      title: 'Apprenticeship & Traineeship Placement',
      description:
        'We specialize in placing apprentices and trainees into suitable roles while managing their progress to ensure adherence to industry regulations.',
      path: '/apprenticeships',
      icon: <BookOpenIcon className="h-8 w-8 text-braden-red" />,
    },
    {
      title: 'Regulatory Compliance Management',
      description:
        'Ensuring all placements adhere to industry regulations and standards, managing compliance with training requirements and workplace safety.',
      path: '/compliance',
      icon: <ShieldCheckIcon className="h-8 w-8 text-braden-red" />,
    },
    {
      title: 'Mentoring & Career Coaching',
      description:
        'Our ongoing support helps apprentices and trainees develop their skills and navigate their career paths effectively through regular mentoring sessions.',
      path: '/mentoring',
      icon: <UsersIcon className="h-8 w-8 text-braden-red" />,
    },
    {
      title: 'Recruitment & Labor Hire Solutions',
      description:
        'We offer both temporary staffing solutions and assistance in finding long-term skilled workers, addressing immediate staffing needs efficiently.',
      path: '/recruitment',
      icon: <BriefcaseIcon className="h-8 w-8 text-braden-red" />,
    },
    {
      title: 'Technology Solutions',
      description:
        'Including software licensing and managed IT services to keep your business operations running smoothly.',
      path: '/technology',
      icon: <ComputerDesktopIcon className="h-8 w-8 text-braden-red" />,
    },
    {
      title: 'Future Services',
      description:
        'Customized training programs, digital skills-matching platform, online learning opportunities, and expanded IT services coming soon.',
      path: '/future-services',
      icon: <RocketLaunchIcon className="h-8 w-8 text-braden-red" />,
    },
  ];

  return (
    <ErrorBoundary>
      <section
        id="services"
        className="py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl mb-12 text-center text-braden-navy">
            Our Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white cursor-pointer transform hover:-translate-y-1 group"
                onClick={() => handleServiceClick(service.path)}
                role="button"
                aria-label={`Learn more about ${service.title}`}
              >
                <div className="flex items-center mb-4">
                  {service.icon}
                  <h3 className="font-montserrat font-bold text-lg md:text-xl ml-3 group-hover:text-braden-red transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="font-opensans text-gray-600 text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default Services;
