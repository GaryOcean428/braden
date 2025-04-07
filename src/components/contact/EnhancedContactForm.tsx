import { ContactForm } from "@/components/ContactForm";
import { useEnhancedContactForm } from "./useEnhancedContactForm";

export function EnhancedContactForm() {
  const { form, isSubmitting, onSubmit, isInitialized } = useEnhancedContactForm();
  
  if (!isInitialized) {
    return <div>Initializing form...</div>;
  }
  
  return (
    <ContactForm 
      form={form} 
      isSubmitting={isSubmitting} 
      onSubmit={onSubmit} 
    />
  );
}
