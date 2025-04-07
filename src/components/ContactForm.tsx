
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ContactFormFields } from "./contact/ContactFormFields";
import { useContactForm } from "./contact/useContactForm";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./contact/types";

interface ContactFormProps {
  form?: UseFormReturn<ContactFormValues>;
  isSubmitting?: boolean;
  onSubmit?: (values: ContactFormValues) => Promise<void>;
}

export function ContactForm({ form, isSubmitting, onSubmit }: ContactFormProps = {}) {
  const defaultFormValues = useContactForm();
  
  // Use provided props or fall back to defaults from useContactForm
  const formProps = form || defaultFormValues.form;
  const submitting = isSubmitting !== undefined ? isSubmitting : defaultFormValues.isSubmitting;
  const submitHandler = onSubmit || defaultFormValues.onSubmit;

  return (
    <Form {...formProps}>
      <form onSubmit={formProps.handleSubmit(submitHandler)} className="space-y-6 text-left">
        <ContactFormFields form={formProps} />
        <Button 
          type="submit" 
          className="w-full bg-brand-primary hover:bg-brand-primary/90"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
