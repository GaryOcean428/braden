import { useState } from 'react';
import { sendLeadToCRM } from '../../lib/crmIntegration';

// Enhanced contact form hook with CRM integration
export const useEnhancedContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format the lead data
      const leadData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message || null,
        services: formData.services || [],
        submission_page: 'contact',
        // Capture UTM parameters if available
        utm_source: getUtmParameter('utm_source'),
        utm_medium: getUtmParameter('utm_medium'),
        utm_campaign: getUtmParameter('utm_campaign')
      };
      
      // Send lead to CRM
      await sendLeadToCRM(leadData);
      
      setIsSuccess(true);
    } catch (err) {
      console.error('Form submission error:', err);
      setError('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to get UTM parameters from URL
  const getUtmParameter = (param) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param) || null;
    }
    return null;
  };

  return {
    isSubmitting,
    isSuccess,
    error,
    handleSubmit
  };
};

export default useEnhancedContactForm;
