
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ContactFormFields } from "./contact/ContactFormFields";
import { useContactForm } from "./contact/useContactForm";
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { ContactFormValues } from "./contact/types";

interface ContactFormProps {
  form?: UseFormReturn<ContactFormValues>;
  isSubmitting?: boolean;
  onSubmit?: SubmitHandler<ContactFormValues>;
}

export function ContactForm({ form, isSubmitting, onSubmit }: ContactFormProps = {}) {
  const defaultFormValues = useContactForm();
  
  // Use provided props or fall back to defaults from useContactForm
  const formProps = form || defaultFormValues.form;
  const submitting = isSubmitting !== undefined ? isSubmitting : defaultFormValues.isSubmitting;
  const submitHandler = onSubmit || defaultFormValues.onSubmit;

  return (
    <Form {...formProps}>
      <form onSubmit={formProps.handleSubmit(submitHandler)} className="space-y-6 text-left font-inter">
        <h3 className="text-2xl font-semibold mb-4 text-braden-navy font-montserrat">Contact Us</h3>
        <p className="text-braden-slate mb-6">
          Get in touch with our team to learn more about how we can help with your employment needs.
        </p>
        
        <ContactFormFields form={formProps} />
        
        <Button 
          type="submit" 
          className="w-full bg-braden-red hover:bg-braden-dark-red text-white font-montserrat transition-colors"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
