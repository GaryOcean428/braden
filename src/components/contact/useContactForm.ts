
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { ContactFormValues } from "./types";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define schema outside the hook to avoid recreating it on each render
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  serviceType: z.enum(['apprenticeship', 'traineeship', 'recruitment', 'technology', 'compliance', 'mentoring', 'future_services'], {
    required_error: "Please select a service type.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: undefined,
      message: "",
    },
  });

  const handleFormSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting form with values:", values);
      
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

      if (leadError) {
        console.error('Lead insert error:', leadError);
        throw leadError;
      }

      // Create a new client
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          name: values.company,
          email: values.email,
          phone: values.phone,
          service_type: values.serviceType,
        });

      if (clientError) {
        console.error('Client insert error:', clientError);
        throw clientError;
      }

      // Send confirmation emails
      const { error: emailError } = await supabase.functions.invoke('send-confirmation', {
        body: values
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        throw emailError;
      }

      toast.success("Thank you for your message. We've sent you a confirmation email and we'll be in touch soon!");
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("There was an error submitting your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: handleFormSubmit,
  };
};
