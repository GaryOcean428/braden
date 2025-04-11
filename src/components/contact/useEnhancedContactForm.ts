
import { useContactForm } from "./useContactForm";
import { ContactFormValues } from "./types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SubmitHandler } from "react-hook-form";

export const useEnhancedContactForm = () => {
  const baseForm = useContactForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("Initializing enhanced contact form");
        // Set initialization to true right away to prevent delays in UI rendering
        setIsInitialized(true);
        
        // Check if we can connect to Supabase - but don't block rendering on this
        const { error } = await supabase
          .from('clients')
          .select('count', { count: 'exact', head: true });
          
        if (error) {
          console.error("Error connecting to database:", error);
          // Continue anyway - the form should still work even if DB connection fails
        }
      } catch (error) {
        console.error("Initialization error:", error);
        // Continue anyway
      }
    };
    
    initialize();
  }, []);
  
  const enhancedSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    try {
      setIsSubmitting(true);
      
      // Create a new lead
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          service_type: values.serviceType,
          message: values.message,
        });
        
      if (leadError) throw leadError;
        
      // Create a new client
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          name: values.company,
          email: values.email,
          phone: values.phone,
          service_type: values.serviceType,
        });
      
      if (clientError) throw clientError;
      
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
