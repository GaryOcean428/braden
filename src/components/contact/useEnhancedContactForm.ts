
import { useContactForm } from "./useContactForm";
import { ContactFormValues } from "./types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useEnhancedContactForm = () => {
  const baseForm = useContactForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("Initializing enhanced contact form");
        // Check if we can connect to Supabase
        const { error } = await supabase
          .from('clients')
          .select('count', { count: 'exact', head: true });
          
        if (error) {
          console.error("Error connecting to database:", error);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Initialization error:", error);
        setIsInitialized(true); // Continue anyway
      }
    };
    
    initialize();
  }, []);
  
  const enhancedSubmit = async (values: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create a new lead
      await supabase
        .from('leads')
        .insert({
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          service_type: values.serviceType,
          message: values.message,
        });
        
      // Create a new client
      await supabase
        .from('clients')
        .insert({
          name: values.company,
          email: values.email,
          phone: values.phone,
          service_type: values.serviceType,
        });
      
      // Notify the user that the message was sent
      toast.success("Thank you for your message. We'll be in touch soon!");
      baseForm.form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("There was an error submitting your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form: baseForm.form,
    isSubmitting,
    onSubmit: enhancedSubmit,
    isInitialized,
  };
};
