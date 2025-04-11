
import EnhancedContactForm from "@/components/contact/EnhancedContactForm";

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

// Make sure to export as default too
export default Contact;
