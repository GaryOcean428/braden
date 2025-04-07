import React, { useState } from 'react';
import { useEnhancedContactForm } from './useEnhancedContactForm';
import ContactFormFields from './ContactFormFields';

const EnhancedContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    services: []
  });

  const { isSubmitting, isSuccess, error, handleSubmit } = useEnhancedContactForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (service) => {
    setFormData(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      
      return {
        ...prev,
        services
      };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700">
          Your message has been received. One of our team members will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ContactFormFields 
        formData={formData}
        handleChange={handleChange}
        handleServiceChange={handleServiceChange}
      />
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-md bg-blue-600 text-white font-medium 
          ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default EnhancedContactForm;
