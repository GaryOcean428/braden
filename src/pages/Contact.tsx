import { ContactForm } from "@/components/ContactForm";
import { EnhancedContactForm } from "@/components/contact/EnhancedContactForm";

// Update the import in the file that uses ContactForm to use EnhancedContactForm instead
export function Contact() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      <div className="max-w-2xl mx-auto">
        <EnhancedContactForm />
      </div>
    </div>
  );
}
