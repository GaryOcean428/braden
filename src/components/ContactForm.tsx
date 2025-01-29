import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ContactFormFields } from "./contact/ContactFormFields";
import { useContactForm } from "./contact/useContactForm";

export function ContactForm() {
  const { form, isSubmitting, onSubmit } = useContactForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6 text-left">
        <ContactFormFields form={form} />
        <Button 
          type="submit" 
          className="w-full bg-brand-primary hover:bg-brand-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}