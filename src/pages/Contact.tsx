
import { ErrorBoundary } from "@/components/ErrorBoundary";
import EnhancedContactForm from "@/components/contact/EnhancedContactForm";

export function Contact() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-braden-navy">Contact Us</h1>
      <div className="max-w-2xl mx-auto">
        <ErrorBoundary>
          <EnhancedContactForm />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default Contact;
